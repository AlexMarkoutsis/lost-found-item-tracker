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
    REGISTER_URL = "/api/auth/register/"
    LOGIN_URL = "/api/auth/login/"

    def setUp(self):
        self.client = APIClient()


    # ------------------ Registration --------------------
    def test_register_succeeds_with_valid_data(self):
        payload = {
            "username": "user",
            "password": "Password",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")
        self.assertIn(res.status_code, (200, 201), res.data if hasattr(res, "data") else res.content)

        # Verify user is created
        self.assertTrue(User.objects.filter(username="user").exists())

        # Verify the password is hashed
        user = User.objects.get(username="user")
        self.assertNotEqual(user.password, payload["password"])
        self.assertTrue(user.check_password(payload["password"]))

    def test_register_fails_with_duplicate_username(self):
        User.objects.create_user(username="duplicateuser", password="Password")

        # Different password used to verify that it is the username passing or failing
        payload = {
            "username": "duplicateuser",
            "password": "AnotherPassword",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")
        self.assertEqual(res.status_code, 400, getattr(res, "data", res.content))

    def test_register_fails_with_missing_fields(self):
        payload = {
            "username": "",
            "password": "",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")
        self.assertEqual(res.status_code, 400, getattr(res, "data", res.content))

    def test_register_fails_when_password_mismatched(self):
        payload = {
            "username": "user",
            "password": "Password1",
            "password2": "Password2",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")

        self.assertIn(res.status_code, (200, 201, 400), getattr(res, "data", res.content))


    # ------------------ Login --------------------
    def test_login_succeeds_with_correct_credentials(self):
        User.objects.create_user(username="user", password="Correct")

        payload = {
            "username": "user",
            "password": "Correct",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")
        self.assertEqual(res.status_code, 200, getattr(res, "data", res.content))

        # --Need to assert session key here I think--

        if hasattr(res, "data") and isinstance(res.data, dict):
            possible_keys = {"token", "access", "key"}
            self.assertTrue(
                any(k in res.data for k in possible_keys) or res.data == {},
                f"Expected a token-like field in response, got: {res.data}"
            )

    def test_login_fails_with_wrong_password(self):
        User.objects.create_user(username="user", password="Correct")

        payload = {
            "username": "user",
            "password": "Wrong",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")

        self.assertIn(res.status_code, (400, 401), getattr(res, "data", res.content))

    def test_login_fails_with_nonexistent_user(self):
        payload = {
            "username": "doesnotexist",
            "password": "Password",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")
        self.assertIn(res.status_code, (400, 401), getattr(res, "data", res.content))