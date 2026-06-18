@ui @auth
Feature: User Login

  As a registered user
  I want to log in to my account
  So that I can access my personalised experience

  # Test Case 2: Login User with correct email and password
  Scenario: Login with correct email and password
    Given I create a new account by API
    And I navigate to the home page
    And the home page is visible
    When I click on Signup Login
    Then 'Login to your account' is visible
    When I login with valid credentials
    Then I should be logged in successfully
    When I delete my account
    Then 'ACCOUNT DELETED!' is visible

  # Test Case 3: Login User with incorrect email and password
  Scenario: Login with incorrect email and password
    Given I navigate to the home page
    And the home page is visible
    When I click on Signup Login
    Then 'Login to your account' is visible
    When I login with email "invalid@example.com" and password "wrongpassword"
    Then I should see the login error message
