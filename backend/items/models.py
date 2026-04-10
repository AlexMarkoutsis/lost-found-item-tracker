from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    Extends Django's built-in User model.
    Matches URS Data Requirements DR-08 through DR-12.
    """

    ROLE_CHOICES = [
        ('standard', 'Standard User'),
        ('moderator', 'Moderator'),
        ('admin', 'Administrator'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Identity
    display_name = models.CharField(max_length=100)
    avatar = models.ImageField(default='profile_images/default_pfp.svg', upload_to='profile_images/')
    description = models.CharField(max_length=700, default="No description.")

    # Permissions
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='standard')
    # is_verified = models.BooleanField(default=False)  # If we use email in the future

    # Preferences
    preferred_building = models.CharField(max_length=100, blank=True)

    # Notifications
    notify_on_match = models.BooleanField(default=True)
    notify_on_claim = models.BooleanField(default=True)
    # notify_email = models.BooleanField(default=True)   # If we use email in the future

    # Stats
    items_reported = models.IntegerField(default=0)
    items_claimed = models.IntegerField(default=0)
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.display_name


class Category(models.Model):
    """
    Category Model to set to Items
    """
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()


class Item(models.Model):
    """
    Core Item model for Lost & Found.
    Matches DR-01 through DR-07.
    """

    STATUS_CHOICES = [
        ('lost', 'Lost'),
        ('found', 'Found'),
        ('claimed', 'Claimed'),
        ('archived', 'Archived'),
    ]

    # DR-01: Unique system-generated ID (Django auto field)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    #category = models.CharField(max_length=100)
    location = models.CharField(max_length=200)

    # DR-02: Date found or lost
    date_reported = models.DateField()

    # DR-03: Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='lost')

    # TODO: DR-04: Optional photo
    # Uncomment later when storage is configured
    image = models.ImageField(upload_to='items/', null=True, blank=True)

    # DR-05: Reporter ID referencing user
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_items')

    # DR-06: Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    claimed_at = models.DateTimeField(null=True, blank=True)

    # DR-07: Archived items remain accessible
    is_archived = models.BooleanField(default=False)

    # Who claimed the item
    claimed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='claimed_items'
    )

    def __str__(self):
        return f"{self.title} ({self.status})"


class ActivityLog(models.Model):
    """
    Tracks user actions for DR-11.
    """
    ACTION_CHOICES = [
        ('submit', 'Submit Item'),
        ('modify', 'Modify Item'),
        ('claim', 'Claim Item'),
        ('archive', 'Archive Item'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.timestamp}"


class Notification(models.Model):
    NOTIF_TYPES = [
        ("item_posted", "Item Posted"),
        ("item_claimed", "Item Claimed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)  # who receives the notification
    actor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="actor_notifications",
        null=True,  # allow null
        blank=True
    )
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    notif_type = models.CharField(max_length=20, choices=NOTIF_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.notif_type}"


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} → {self.recipient}: {self.content[:20]}"