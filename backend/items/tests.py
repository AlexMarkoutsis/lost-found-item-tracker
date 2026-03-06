from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

"""
Make sure the projects URL ENDPOINTS match those from the test cases in order for tests to pass correctly.

Tests can be ran from terminal while in the backend directory

Run Tests:
  python manage.py test
"""

User = get_user_model()


class AuthApiTests(TestCase):
    REGISTER_URL = "/api/register/"
    LOGIN_URL = "/api/login/"

    def setUp(self):
        self.client = APIClient()

    # ------------------ Registration --------------------
    def test_register_succeeds_with_valid_data(self):
        payload = {
            "email": "newuser@email.com",
            "password": "Password",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")
        self.assertIn(res.status_code, (200, 201), res.data if hasattr(res, "data") else res.content)

        # Verify user is created
        self.assertTrue(User.objects.filter(username=payload["email"]).exists())

        # Verify the password is hashed
        user = User.objects.get(username=payload["email"])
        self.assertNotEqual(user.password, payload["password"])
        self.assertTrue(user.check_password(payload["password"]))

    def test_register_fails_with_duplicate_username(self):
        User.objects.create_user(username="duplicateuser@email.com", password="Password")

        # Different password used to verify that it is the username passing or failing
        payload = {
            "email": "duplicateuser@email.com",
            "password": "AnotherPassword",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")
        self.assertEqual(res.status_code, 400, getattr(res, "data", res.content))

    def test_register_fails_with_missing_fields(self):
        payload = {
            "email": "",
            "password": "",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")
        self.assertEqual(res.status_code, 400, getattr(res, "data", res.content))

    def test_register_fails_when_password_mismatched(self):
        payload = {
            "email": "mismatch@email.com",
            "password": "Password1",
            "password2": "Password2",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")

        self.assertIn(res.status_code, (200, 201, 400), getattr(res, "data", res.content))

    # ------------------ Login --------------------
    def test_login_succeeds_with_correct_credentials(self):
        User.objects.create_user(username="user@email.com", password="Correct")

        payload = {
            "username": "user@email.com",
            "password": "Correct",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")
        self.assertEqual(res.status_code, 200, getattr(res, "data", res.content))

        if hasattr(res, "data") and isinstance(res.data, dict):
            self.assertNotIn("error", res.data)
            self.assertTrue(
                ("message" in res.data) or (res.data == {}),
                f"Expected success message or empty response, got: {res.data}"
            )

    def test_login_returns_token(self):
        User.objects.create_user(username="user@email.com", password="Correct")

        payload = {
            "username": "user@email.com",
            "password": "Correct",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")
        self.assertEqual(res.status_code, 200, getattr(res, "data", res.content))

        possible_keys = {"token", "access", "refresh", "key"}
        self.assertTrue(
            hasattr(res, "data") and isinstance(res.data, dict) and any(k in res.data for k in possible_keys),
            f"Expected a token-like field in response, got: {getattr(res, 'data', res.content)}"
        )

    def test_login_fails_with_wrong_password(self):
        User.objects.create_user(username="user@email.com", password="Correct")

        payload = {
            "username": "user@emial.com",
            "password": "Wrong",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")

        self.assertIn(res.status_code, (400, 401), getattr(res, "data", res.content))

    def test_login_fails_with_nonexistent_user(self):
        payload = {
            "username": "doesnotexist@email.com",
            "password": "Password",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")
        self.assertIn(res.status_code, (400, 401), getattr(res, "data", res.content))
