# Email Confirmation Redirection Setup

## Tasks

- [x] Create `app/callback.tsx` to handle the auth callback and process email confirmation (moved to root level)
- [x] Update `app/_layout.tsx` to include the callback screen in the root stack (public route)
- [x] Remove callback from `app/auth/_layout.tsx`
- [x] Update `lib/authContext.tsx` redirect URL to 'exp://192.168.1.13:8081/--/callback' (moved callback route)

## Followup Steps

- [x] Fixed callback to properly handle email confirmation tokens
- [ ] Test email confirmation flow (user needs to sign up again with new redirect URL)
- [ ] Verify deep linking works with exp:// scheme
