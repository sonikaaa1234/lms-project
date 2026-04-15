from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import UserSession

class SingleSessionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if 'HTTP_AUTHORIZATION' in request.META:
            try:
                auth = JWTAuthentication()
                header = auth.get_header(request)
                if header:
                    raw_token = auth.get_raw_token(header)
                    validated_token = auth.get_validated_token(raw_token)
                    user = auth.get_user(validated_token)
                    
                    if user and user.is_authenticated:
                        # Check if this token is the currently active one for the user
                        token_str = raw_token.decode('utf-8')
                        active_session = UserSession.objects.filter(user=user, is_active=True).first()
                        
                        if not active_session or active_session.session_token != token_str:
                            return JsonResponse({"detail": "Session expired or active on another device."}, status=401)
            except Exception as e:
                # If token is invalid or expired, simplejwt will handle it in views
                pass
        return None
