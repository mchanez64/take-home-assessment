@auth
Feature: User Registration — Test Case 1

  As a new visitor
  I want to create an account
  So that I can shop and track my orders

  Scenario: Register a new user account
    Given I navigate to the home page
    And the home page is visible
    When I click on Signup Login
    Then 'New User Signup!' is visible
    When I enter a new name and email and click Signup
    Then 'ENTER ACCOUNT INFORMATION' is visible
    When I complete the account details form with newsletter preferences
    And I click Create Account
    Then 'ACCOUNT CREATED!' is visible
    When I click Continue
    Then I should be logged in as the new user
    When I delete my account
    Then 'ACCOUNT DELETED!' is visible
