from rest_framework.permissions import SAFE_METHODS, BasePermission


class HasRole(BasePermission):
    """Base class for role-gated permissions. Subclasses set `role`."""

    role = None

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.role == self.role or user.role == "ADMIN")
        )


class IsSupplier(HasRole):
    role = "SUPPLIER"


class IsLab(HasRole):
    role = "LAB"


class IsHotel(HasRole):
    role = "HOTEL"


class IsAdmin(HasRole):
    role = "ADMIN"


class IsApprovedRole(BasePermission):
    """Blocks write actions from suppliers/labs whose account is still pending admin approval."""

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        if user.role not in ("SUPPLIER", "LAB"):
            return True
        return user.approval_status == "APPROVED"


class IsOwner(BasePermission):
    """Object-level permission checking `obj.<owner_field>` (default 'owner') against request.user.

    Views using this should set `owner_lookup` to the attribute path from the object to
    the owning User, e.g. "supplier.user" for a Batch owned via its SupplierProfile.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.role == "ADMIN":
            return True
        owner_lookup = getattr(view, "owner_lookup", "user")
        target = obj
        for attr in owner_lookup.split("."):
            target = getattr(target, attr, None)
            if target is None:
                return False
        return target == request.user
