from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(
            user=instance,
            display_name=instance.username,
            role="standard"
        )


@receiver(post_save, sender=User)
def ensure_superuser_is_admin(sender, instance, created, **kwargs):
    """
    Ensures that any superuser always has a UserProfile with role='admin'.
    This runs on creation AND on updates.
    """
    user = instance

    # Only enforce for superusers
    if user.is_superuser:
        profile, _ = UserProfile.objects.get_or_create(user=user)

        if profile.role != "admin":
            profile.role = "admin"
            profile.save()
