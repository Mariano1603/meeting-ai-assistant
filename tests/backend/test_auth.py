#!/usr/bin/env python3
"""
Authentication API testing script with guest user creation
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health():
    """Test if API is running"""
    print("🔍 Testing API health...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ API is healthy:", response.json())
            return True
        else:
            print("❌ API health check failed:", response.status_code)
            return False
    except Exception as e:
        print("❌ Could not connect to API:", str(e))
        return False

def create_guest_user():
    """Create a guest user for testing"""
    print("\n🔍 Creating guest user...")
    guest_user = {
        "email": "guest@meetingai.com",
        "full_name": "Guest User",
        "password": "guestpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=guest_user)
        if response.status_code == 200:
            user_data = response.json()
            print("✅ Guest user created successfully:")
            print(f"   📧 Email: {user_data['email']}")
            print(f"   👤 Name: {user_data['full_name']}")
            print(f"   🆔 ID: {user_data['id']}")
            return guest_user, user_data
        elif response.status_code == 400 and "Email already registered" in response.text:
            print("ℹ️  Guest user already exists, that's fine!")
            return guest_user, None
        else:
            print("❌ Guest user creation failed:", response.status_code, response.text)
            return None, None
    except Exception as e:
        print("❌ Error creating guest user:", str(e))
        return None, None

def test_login(user_credentials):
    """Test user login"""
    print("\n🔍 Testing login...")
    login_data = {
        "username": user_credentials["email"],  # OAuth2 uses 'username'
        "password": user_credentials["password"]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            data=login_data,  # Form data for OAuth2
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Login successful!")
            print(f"   🔑 Token type: {token_data['token_type']}")
            print(f"   ⏰ Token received (length: {len(token_data['access_token'])} chars)")
            return token_data["access_token"]
        else:
            print("❌ Login failed:", response.status_code, response.text)
            return None
    except Exception as e:
        print("❌ Error during login:", str(e))
        return None

def test_authenticated_request(token):
    """Test authenticated endpoint"""
    print("\n🔍 Testing authenticated request (/me)...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
        if response.status_code == 200:
            user_data = response.json()
            print("✅ Authenticated request successful:")
            print(f"   👤 User: {user_data['full_name']}")
            print(f"   📧 Email: {user_data['email']}")
            print(f"   🆔 ID: {user_data['id']}")
            print(f"   ✅ Active: {user_data['is_active']}")
            print(f"   📅 Created: {user_data['created_at']}")
            return True
        else:
            print("❌ Authenticated request failed:", response.status_code, response.text)
            return False
    except Exception as e:
        print("❌ Error in authenticated request:", str(e))
        return False

def test_unauthenticated_request():
    """Test unauthenticated request to protected endpoint"""
    print("\n🔍 Testing unauthenticated request (should fail)...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/auth/me")
        if response.status_code == 401:
            print("✅ Correctly rejected unauthenticated request")
            return True
        else:
            print("❌ Unexpectedly allowed unauthenticated request:", response.status_code)
            return False
    except Exception as e:
        print("❌ Error testing unauthenticated request:", str(e))
        return False

def test_invalid_login():
    """Test login with invalid credentials"""
    print("\n🔍 Testing invalid login credentials...")
    invalid_data = {
        "username": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            data=invalid_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 401:
            print("✅ Correctly rejected invalid credentials")
            return True
        else:
            print("❌ Unexpectedly accepted invalid credentials:", response.status_code)
            return False
    except Exception as e:
        print("❌ Error testing invalid login:", str(e))
        return False

def test_duplicate_registration():
    """Test duplicate user registration"""
    print("\n🔍 Testing duplicate user registration...")
    duplicate_user = {
        "email": "guest@meetingai.com",  # Same as guest user
        "full_name": "Duplicate User",
        "password": "somepassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=duplicate_user)
        if response.status_code == 400 and "Email already registered" in response.text:
            print("✅ Correctly rejected duplicate email registration")
            return True
        else:
            print("❌ Unexpectedly allowed duplicate registration:", response.status_code)
            return False
    except Exception as e:
        print("❌ Error testing duplicate registration:", str(e))
        return False

def main():
    print("🚀 Testing Meeting AI Assistant Authentication")
    print("=" * 50)
    
    # Test API health
    if not test_health():
        print("\n❌ API is not accessible. Make sure the backend is running.")
        return
    
    # Create guest user
    guest_credentials, guest_data = create_guest_user()
    if not guest_credentials:
        print("\n❌ Could not create guest user. Exiting.")
        return
    
    # Test login with guest user
    token = test_login(guest_credentials)
    if not token:
        print("\n❌ Login failed. Exiting.")
        return
    
    # Test authenticated requests
    test_authenticated_request(token)
    
    # Test security features
    test_unauthenticated_request()
    test_invalid_login()
    test_duplicate_registration()
    
    print("\n" + "=" * 50)
    print("🎉 All authentication tests completed!")
    print("\n📝 Guest User Credentials for testing:")
    print(f"   📧 Email: guest@meetingai.com")
    print(f"   🔑 Password: guestpassword123")
    print("\n🔗 API Endpoints tested:")
    print("   ✅ POST /api/v1/auth/register - User registration")
    print("   ✅ POST /api/v1/auth/login - User login")
    print("   ✅ GET /api/v1/auth/me - Get current user")
    print("\n📖 API Documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main()

