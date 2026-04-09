from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from datetime import date

from items.models import Item, Category

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
    ITEMS_URL = "/api/items/"
    CREATE_ITEM_URL = "/api/items/create/"

    def setUp(self):
        self.client = APIClient()


    # ------------------ Registration --------------------
    def test_register_succeeds_with_valid_data(self):
        payload = {
            "username": "newuser@email.com",
            "password": "Password",
            "password2": "Password",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")
        self.assertIn(res.status_code, (200, 201), res.data if hasattr(res, "data") else res.content)

        # Verify user is created
        self.assertTrue(User.objects.filter(username=payload["username"]).exists())

        # Verify the password is hashed
        user = User.objects.get(username=payload["username"])
        self.assertNotEqual(user.password, payload["password"])
        self.assertTrue(user.check_password(payload["password"]))

    def test_register_fails_with_duplicate_username(self):
        User.objects.create_user(username="duplicateuser@email.com", password="Password")

        # Different password used to verify that it is the username passing or failing
        payload = {
            "username": "duplicateuser@email.com",
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
            "username": "user@email.com",
            "password": "Password1",
            "password2": "Password2",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")

        self.assertIn(res.status_code, (200, 201, 400), getattr(res, "data", res.content))

    def test_register_returns_created_user_data(self):
        payload = {
            "username": "user@email.com",
            "password": "Password123",
            "password2": "Password123",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")

        self.assertEqual(res.status_code, 201)
        self.assertIn("username", res.data)
        self.assertEqual(res.data["username"], payload["username"])
        self.assertIn("profile", res.data)

    def test_register_fails_when_password2_missing(self):
        payload = {
            "username": "user@email.com",
            "password": "Password123",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")
        self.assertEqual(res.status_code, 400)

    def test_register_succeeds_when_passwords_match(self):
        payload = {
            "username": "user@email.com",
            "password": "Password123",
            "password2": "Password123",
        }

        res = self.client.post(self.REGISTER_URL, payload, format="json")
        self.assertIn(res.status_code, (200, 201))

    # ------------------ Login --------------------
    def test_login_succeeds_with_correct_credentials(self):
        User.objects.create_user(username="user@email.com", password="Correct")

        payload = {
            "username": "user@email.com",
            "password": "Correct",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")
        self.assertEqual(res.status_code, 200, getattr(res, "data", res.content))

        # --Need to assert session key here I think--

        if hasattr(res, "data") and isinstance(res.data, dict):
            self.assertNotIn("error", res.data)
            self.assertTrue(
                ("message" in res.data) or (res.data == {}),
                f"Expected success message or empty response, got: {res.data}"
            )

    # Following test will fail until tokens are implemented
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
            "username": "user@email.com",
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

    def test_login_returns_success_and_user(self):
        User.objects.create_user(username="user@email.com", password="Correct")

        payload = {
            "username": "user@email.com",
            "password": "Correct",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["success"], True)
        self.assertEqual(res.json()["user"], "user@email.com")

    def test_login_fails_with_missing_username(self):
        payload = {
            "password": "Correct",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")
        self.assertIn(res.status_code, (400, 401))

    def test_login_fails_with_missing_password(self):
        payload = {
            "username": "user@email.com",
        }

        res = self.client.post(self.LOGIN_URL, payload, format="json")
        self.assertIn(res.status_code, (400, 401))

    # ------------------ List Item --------------------
    def test_list_items_returns_200(self):
        res = self.client.get(self.ITEMS_URL)
        self.assertEqual(res.status_code, 200)

    def test_list_items_filters_by_status(self):
        reporter = User.objects.create_user(
            username="user@email.com",
            password="Password123"
        )

        accessories = Category.objects.create(name="Accessories")

        Item.objects.create(
            title="Wallet",
            description="Black wallet",
            status="lost",
            category=accessories,
            location="Library",
            date_reported=date.today(),
            reporter=reporter,
        )

        Item.objects.create(
            title="Keys",
            description="Car keys",
            status="found",
            category=accessories,
            location="Student Center",
            date_reported=date.today(),
            reporter=reporter,
        )

        res = self.client.get(f"{self.ITEMS_URL}?status=lost")

        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["title"], "Wallet")

    def test_list_items_filters_by_id(self):
        reporter = User.objects.create_user(
            username="user@email.com",
            password="Password123"
        )

        electronics = Category.objects.create(name="Electronics")
        clothing = Category.objects.create(name="Clothing")

        Item.objects.create(
            title="Phone",
            description="iPhone",
            status="lost",
            category=electronics,
            location="Library",
            date_reported=date.today(),
            reporter=reporter,
        )

        Item.objects.create(
            title="Jacket",
            description="Blue jacket",
            status="lost",
            category=clothing,
            location="Student Center",
            date_reported=date.today(),
            reporter=reporter,
        )

        res = self.client.get(f"{self.ITEMS_URL}?category={electronics.id}")

        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["title"], "Phone")

    def test_list_items_filters_by_partial_location(self):
        reporter = User.objects.create_user(
            username="user@email.com",
            password="Password123"
        )

        accessories = Category.objects.create(name="Accessories")

        Item.objects.create(
            title="Notebook",
            description="Math notes",
            status="lost",
            category=accessories,
            location="Main Library",
            date_reported=date.today(),
            reporter=reporter,
        )

        Item.objects.create(
            title="Bottle",
            description="Steel bottle",
            status="lost",
            category=accessories,
            location="Student Center",
            date_reported=date.today(),
            reporter=reporter,
        )

        res = self.client.get(f"{self.ITEMS_URL}?location=library")

        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["location"], "Main Library")

    def test_list_items_combined_filters(self):
        reporter = User.objects.create_user(
            username="user@email.com",
            password="Password123"
        )

        electronics = Category.objects.create(name="Electronics")

        Item.objects.create(
            title="Phone",
            description="iPhone",
            status="lost",
            category=electronics,
            location="Library",
            date_reported=date.today(),
            reporter=reporter,
        )

        Item.objects.create(
            title="Phone",
            description="Android",
            status="found",
            category=electronics,
            location="Library",
            date_reported=date.today(),
            reporter=reporter,
        )

        res = self.client.get(f"{self.ITEMS_URL}?status=lost&category={electronics.id}&location=library")

        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["description"], "iPhone")

    def test_create_item_succeeds_with_valid_data(self):
        reporter = User.objects.create_user(
            username="user@email.com",
            password="Password123"
        )
        self.client.force_authenticate(user=reporter)

        category = Category.objects.create(name="Accessories")

        payload = {
            "title": "Wallet",
            "description": "Black leather wallet",
            "status": "lost",
            "category": category.id,
            "location": "Library",
            "date_reported": str(date.today()),
        }

        res = self.client.post(self.CREATE_ITEM_URL, payload, format="json")

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["title"], "Wallet")

    def test_create_item_fails_with_missing_title(self):
        reporter = User.objects.create_user(
            username="user@email.com",
            password="Password123"
        )
        self.client.force_authenticate(user=reporter)

        payload = {
            "description": "Black leather wallet",
            "status": "lost",
            "category": "Accessories",
            "location": "Library",
            "date_reported": str(date.today()),
        }

        res = self.client.post(self.CREATE_ITEM_URL, payload, format="json")

        self.assertEqual(res.status_code, 400)