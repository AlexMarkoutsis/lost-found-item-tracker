from django.db import models
from django.contrib.auth.models import User


class TESTU(models.Model):

    ROL_CHOICES = [
        ('standar', 'Standard Use'),
        ('moderato', 'Moderato'),
        ('admi', 'Administrato'),
    ]

    use = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profil')
    display_nam = models.CharField(max_length=100)
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='standard')

    # DR-11: Activity logs will be implemented as a separate model
    # DR-12: PII is stored here but not exposed publicly

    def __str__(self):
        return self.display_nam

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
    display_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='standard')

    # DR-11: Activity logs will be implemented as a separate model
    # DR-12: PII is stored here but not exposed publicly

    def __str__(self):
        return self.display_name


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
    category = models.CharField(max_length=100)
    location = models.CharField(max_length=200)

    # DR-02: Date found or lost
    date_reported = models.DateField()

    # DR-03: Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='lost')

    # TODO: DR-04: Optional photo
    # Uncomment later when storage is configured
    # photo = models.ImageField(upload_to='items/', null=True, blank=True)

    # DR-05: Reporter ID referencing user
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_items')

    # DR-06: Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    claimed_at = models.DateTimeField(null=True, blank=True)

    # DR-07: Archived items remain accessible
    is_archived = models.BooleanField(default=False)

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