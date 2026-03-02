# HLSR ITC Shift Manager — User Manual

**App URL:** https://itc-shifts.com

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [Getting Started](#getting-started)
   - [Logging In](#logging-in)
   - [Forgot Password](#forgot-password)
   - [Logging Out](#logging-out)
4. [Navigation](#navigation)
5. [Daily Shifts](#daily-shifts)
6. [Volunteer Shifts](#volunteer-shifts)
7. [ITC Roster](#itc-roster)
8. [Registered Users (Admin Only)](#registered-users-admin-only)
   - [Register a New User](#register-a-new-user)
   - [Assign or Change a Role](#assign-or-change-a-role)
   - [Reset a User's Password](#reset-a-users-password)
   - [Remove a User](#remove-a-user)
9. [Role Access Summary](#role-access-summary)

---

## Overview

The HLSR ITC Shift Manager is a web application used by the Information Technology Committee (ITC) to manage volunteer shifts during the Houston Livestock Show and Rodeo. It provides:

- A live daily shift board showing who is scheduled and clocked in
- A personal shift history report for each committee member
- A searchable ITC committee member directory
- An admin area for managing user accounts and access levels

---

## User Roles

The app has four access levels. Your role determines which pages and features you can see.

| Role | Description |
|---|---|
| **Admin** | Full access. Can manage users, view all pages. |
| **Leadership** | Can view Daily Shifts, Volunteer Shifts, and ITC Roster. |
| **Committeeman** | Can view Daily Shifts and their own Volunteer Shifts only. |
| **Basic** | Can view Daily Shifts only. |

Your role (if Admin or Leadership) is shown in the top-right corner of the header next to your name.

---

## Getting Started

### Logging In

1. Go to **https://itc-shifts.com**
2. Enter your **Email** and **Password**
3. Click **Log In**

If your credentials are correct you will be taken to the Daily Shifts page. If the login fails, an error message will appear below the form — check that your email and password are correct.

> **Note:** Accounts must be created by an Admin. Contact your committee administrator if you do not have an account.

---

### Forgot Password

1. On the Login page, click **Forgot Password?**
2. Enter your email address and click **Reset Password**
3. Check your inbox for a reset email from Firebase and follow the link in that email
4. Once your password is reset, return to the Login page and sign in with your new password

---

### Logging Out

- **Desktop:** Click **LOGOUT** in the top navigation bar
- **Mobile:** Open the menu (three-line icon, top right) and tap **SIGN OUT**

---

## Navigation

The navigation bar appears at the top of every page after you log in. The menu items shown depend on your role.

| Menu Item | Visible To |
|---|---|
| Daily Shifts | All roles |
| Volunteer Shifts | Leadership, Admin, Committeeman |
| ITC Roster | Leadership, Admin |
| Registered Users | Admin |
| Logout | All roles |

**On mobile/tablet**, the menu collapses into a hamburger icon (≡) in the top-right corner. Tap it to open the dropdown menu.

---

## Daily Shifts

**Menu:** Daily Shifts &nbsp;|&nbsp; **Visible to:** All roles

This is the main dashboard of the app. It shows all volunteers scheduled to work on a selected date, organized by shift category, and updates automatically every 60 seconds.

### How to use

1. The page loads with today's date pre-selected
2. Use the **date picker** to navigate to any other date
3. Shifts are grouped into three sections:
   - **Captains**
   - **Showtime Support**
   - **Rookies**
4. Each section shows a table with the following columns:

| Column | Description |
|---|---|
| Start Time | Scheduled start time of the shift |
| End Time | Scheduled end time of the shift |
| Committee Person | Volunteer's name |
| Shift Role | The specific role assigned for that shift |
| Clocked In | Green indicator (●) if the volunteer is currently on duty |

5. The **Clocked In** column updates every 60 seconds automatically — no refresh needed.

> **Tip:** If a section (Captains, Showtime Support, Rookies) has no shifts on the selected date, it will show "No shifts found."

---

## Volunteer Shifts

**Menu:** Volunteer Shifts &nbsp;|&nbsp; **Visible to:** Admin, Leadership, Committeeman

This page shows the full shift history for a committee member for the current calendar year, along with a total hours summary.

### How to use

1. The page loads with **your own account** pre-selected in the Committee Member dropdown
2. The page title shows:
   `[Member Name] — X Shifts (Y hrs.)`
3. The table shows each shift with:

| Column | Description |
|---|---|
| Date | Date of the shift (YYYY-MM-DD) |
| Start Time | Scheduled start time |
| End Time | Scheduled end time |
| Shift Hours | Calculated duration in decimal hours |
| Shift Role | Role assigned for that shift |

4. Click **Date** or **Shift Role** column headers to sort

### Viewing another member's shifts

- **Admin and Leadership** users can click the **Committee Member** dropdown and select any member from the list
- **Committeeman** users see only their own shifts — the dropdown is locked and cannot be changed

> If no shifts are found for the selected member and year, the table will show "No shifts found."

---

## ITC Roster

**Menu:** ITC Roster &nbsp;|&nbsp; **Visible to:** Admin, Leadership

This page displays the full ITC committee member directory.

### How to use

1. The page loads and displays all committee members sorted alphabetically by name
2. The page title shows:
   `[Committee Name] Roster (X members)`
3. The table columns are:

| Column | Description |
|---|---|
| Name | Member's display name |
| E-mail Address | Member's email address |
| Title | Member's committee title/position |

### Searching

- Type in the **Search** box at the top of the table to filter members
- The search matches against **Name**, **E-mail Address**, and **Title** simultaneously
- Clear the search box to show all members again

---

## Registered Users (Admin Only)

**Menu:** Registered Users &nbsp;|&nbsp; **Visible to:** Admin only

This page lets administrators manage all user accounts in the system. You can register new users, assign roles, reset passwords, and remove accounts.

The table shows all registered users with columns: **Name**, **E-mail**, **Role**, and **Actions**.
Use the **Search** box to filter by name, email, or role.

---

### Register a New User

1. Click the **Register User** button (top right)
2. In the dialog:
   - Select the **committee member** from the dropdown (pulls from the ITC member list)
   - Enter an **initial password** for the account
     *(must be at least 8 characters with at least one uppercase and one lowercase letter)*
   - Click the eye icon to show/hide the password
3. Click **Register**
4. A success or error message will appear

> After registering, assign a role using the **Set Role** button so the user sees the correct pages when they log in.

---

### Assign or Change a Role

1. Find the user in the table and click **Set Role**
2. In the **Edit User** dialog:
   - The **Name** field is editable — update the display name if needed
   - The **E-mail** field is read-only
   - Select a role using the radio buttons:
     - **Admin** — Full access
     - **Leadership** — Access to Shifts, Volunteer Shifts, and Roster
     - **Committeeman** — Access to Shifts and their own Volunteer Shifts
     - **Basic** — Access to Daily Shifts only
3. Click **Set Role** to save

> Role changes take effect the next time the user logs in (or refreshes their session).

---

### Reset a User's Password

1. Find the user in the table and click **Reset Password**
2. In the dialog, enter the **new password**
   *(must be at least 8 characters with at least one uppercase and one lowercase letter)*
3. Click the eye icon to show/hide the password
4. Click **Reset Password** to apply

---

### Remove a User

1. Find the user in the table and click **Remove** (red button)
2. A confirmation dialog will appear showing the user's name and email
3. Read the warning — this action is **permanent and cannot be undone**
4. Click **Remove User** to confirm, or **Cancel** to go back

---

## Role Access Summary

| Page | Admin | Leadership | Committeeman | Basic |
|---|:---:|:---:|:---:|:---:|
| Daily Shifts | ✅ | ✅ | ✅ | ✅ |
| Volunteer Shifts | ✅ (any member) | ✅ (any member) | ✅ (own only) | ❌ |
| ITC Roster | ✅ | ✅ | ❌ | ❌ |
| Registered Users | ✅ | ❌ | ❌ | ❌ |

---

*For account setup or access issues, contact your HLSR ITC committee administrator.*
