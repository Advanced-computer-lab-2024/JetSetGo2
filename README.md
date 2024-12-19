# JetSetGo2
Welcome to **JetSetGo2**, your ultimate travel companion!  
JetSetGo2 is a web-based platform designed to simplify and enhance the process of planning your trips. Whether you're traveling for leisure, business, or adventure, JetSetGo offers a seamless experience by bringing all your travel needs to one place.

## Motivation
JetSetGo2 is your ultimate travel companion, created to transform the way you plan trips. It eliminates the hassle of manual planning and introduces a seamless, all-in-one platform that empowers you to manage every aspect of your journey effortlessly. Whether it’s personalized itineraries, smart budgeting, or real-time updates, JetSetGo2 ensures your travel experience is stress-free and unforgettable.

## Build Status
JetSetGo2 is currently under active development and is not yet recommended for production environments. While the core features are operational, a few exciting enhancements are still in progress:    

  
• **Loyalty Level and Badge Updates**:  
This feature, designed to reward our users, is still in the works and will be a game-changer once implemented.  
•**Promo Code Creation by Admin**:  
The groundwork for this feature is ready, but a missing navigation button is temporarily keeping this functionality out of reach. Stay tuned for its debut!  
•**UI/UX Enhancements**:  
The visual experience is evolving, and our team is dedicated to delivering a polished, intuitive interface in upcoming updates.  
•**Performance and Scalability Optimizations**:  
Efforts are ongoing to ensure JetSetGo2 is faster, smoother, and capable of handling a growing user base.

## Code Style
We follow the StandardJS code style guidelines for JavaScript.

## Screenshots
![image](https://github.com/user-attachments/assets/7308cf9c-1722-4a75-a26f-fcbe2b1b039e)

![image](https://github.com/user-attachments/assets/be5f7e07-52e8-445c-93fa-1539bc386b42)


## Tech/Framework used
- *Frontend*: React 
- *Backend*: Node.js, Express, MongoDB
- *Authentication*: JWT
- *Payment Gateway*: Stripe
- *Maps*: openstreetmap api


## Features 
-**User Authentication**: Secure registration and login system for multiple user roles, including tourists, tour guides, and advertisers.
-**Password Recovery**: Recover passwords with OTP verification for seamless account access.
-**Profile Customization**: Users can update personal details and preferences for a tailored experience.
-**Role-Based Access**: Distinct functionalities for tourists, tour guides, advertisers, and tourism governance entities.
-**Trip Planning**: Comprehensive tools for planning trips, including itinerary creation and activity organization.
-**Activity Management**: Schedule and manage activities during trips with intuitive options.
-**Search and Filter**: Advanced search options for destinations, services, and reviews.
-**Responsive Design**: Fully responsive platform for optimal use on both mobile and desktop devices.
-**User Profiles**: Manage user profiles with travel histories and preferences.
-**Reviews and Recommendations**: Access and contribute to reviews and recommendations for destinations and services.
-**Social Integration**: Share trips, reviews, and recommendations with other users.
-**Feedback Collection**: Built-in feedback mechanism for continuous improvement and user satisfaction.
-**Notifications**: Timely alerts for upcoming trips, activities, and important updates.
-**Secure Data Management**: Robust security for personal and sensitive user data.
-**Third-Party Integration**: API integration for additional travel-related services.
-**Age Validation**: Automated validation for age-restricted services.
-**Guest Access**: Limited functionalities for non-registered users to explore the platform.
-**Booking History**: View and manage past trip and service bookings.
-**Multi-User Support**: Handle multiple user roles with distinct dashboards and permissions.
-**Admin Management**: Comprehensive admin tools for monitoring platform activity and enforcing compliance.
-**Promotional Tools**: Options for advertisers to promote services and destinations effectively.
-**interactive Maps**: Visualize destinations and travel plans with integrated map support.
-**Multi-Language Support**: Enhanced accessibility with support for multiple languages.
-**Promotions and Discounts**: Receive personalized promo codes and offers for enhanced engagement.
-**Loyalty Rewards**: Earn points for frequent travel activities and redeem them for discounts.

## Code Examples
```javascript
const createTourist = async (req, res) => {
  // create a tourist after sign up
  const {
    Email,
    UserName,
    Password,
    MobileNumber,
    Nationality,
    DateOfBirth,
    Job,
  } = req.body;

  // Validation checks
  if (
    !Email ||
    !UserName ||
    !Password ||
    !MobileNumber ||
    !Nationality ||
    !DateOfBirth ||
    !Job
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Example: Validate Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Example: Validate MobileNumber (it should be a number and not less than 10 digits)
  if (isNaN(MobileNumber) || MobileNumber.toString().length < 10) {
    return res
      .status(400)
      .json({ error: "Mobile number must be at least 10 digits." });
  }

  // Example: Validate DateOfBirth (it should be a valid date)
  const dob = new Date(DateOfBirth);
  if (isNaN(dob.getTime())) {
    return res.status(400).json({ error: "Invalid date of birth." });
  }

  try {
    const tourist = await touristModel.create({
      Email,
      UserName,
      Password,
      MobileNumber,
      Nationality,
      DateOfBirth,
      Job,
      Admin_Acceptance: true,
    });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

 

 This component allows a user (tourist) to create an account by entering details like username, email, password, and more. The form data is sent to a backend API for processing, and the user is redirected to a login page upon successful signup.
## Installation
To install and run JetSetGo2 , please follow these steps:
1. **Clone Our Repository**:
```sh
git clone https://github.com/Advanced-computer-lab-2024/JetSetGo2.git
```
2. **Install dependencies**:
```sh
cd frontend
npm install
cd backend 
npm install
```
3. **Set environment variables**:
Create a `.env` file in the root directory and add the necessary environment variables:
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```
4. **Run the application**:
```sh
cd frontend
npm start
cd backend
nodemon server.js
```

## How to Use?
1.*Register*: Create an account by signing up with your email, username, and password.
2.*Login*: Access your account securely with your registered credentials.
3.*Recover Password*: Use the "Forgot Password" feature to reset your password via OTP sent to your email.
4.*Create Profile*: Update personal information and preferences to personalize your experience.
5.*Plan Trip*: Add destinations, activities, and schedules to your travel itinerary.
6*Search and Filter*: Use advanced search and filter options to find recommendations and services.
7.*Book Services*: Book flights, hotels, and activities directly through the platform.
8.*Manage Bookings*: View and manage your past bookings in the "Booking History" section.
9.*Write Reviews*: Provide feedback by writing reviews for destinations and services.
10.*Receive Notifications*: Get alerts for upcoming activities, booking confirmations, and special offers.
11.*Share Travel Plans*: Share your itineraries and experiences on social media platforms.
12.*Use Admin Dashboard*: Admin users can manage platform activity, including user monitoring and content compliance.
13.*View Interactive Maps*: Visualize travel routes and destinations with integrated maps.
14.*Access Customer Support*: Reach out for assistance with any queries or technical issues.
15.*Use Multi-Language Support*: Set your preferred language for an enhanced experience.
16.*Access Offline*: View your travel itineraries and information even when you are offline.

## Contribute
We encourage and value contributions to JetSetGo2. To get involved, please follow these steps:
1.Fork the repository to your own account.
2.Create a new branch (git checkout -b feature-branch).
3.Implement your changes.
4.Commit the changes (git commit -m 'Add new feature').
5.Push the changes to your branch (git push origin feature-branch).
6.Submit a pull request for review.


## Credits
We would like to express our gratitude to the following resources and individuals for their valuable contributions and inspiration:
MongoDB
Node.js
Stripe
Google Maps API
StandardJS
React

## License
This project is distributed under the MIT License.

## contact
For any questions, feedback, or assistance, please reach out to us at 


Thank you for choosing JetSetGo2 – now go pack your bags and let the adventures begin!

