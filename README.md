<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<h3 align="center">SCHOOLWORK : YOURWARYOURWAY</h3>

<p align="center">
School work : This serves as the proof of concept for a chat feature.
</p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#frontend-installation">Frontend Installation</a></li>
        <li><a href="#backend-installation">Backend Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

A basic social mvp app allowing individuals to share their thoughts on dev related topics.

### Built With

- Java 17
- Spring Boot 3.3.0
- Lombok Annotations
- MySQL 8.0.33
- Spring JPA
- Spring Boot Websocket Starter
- Angular
- StompJS
- SockJS

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To run the app, you will need to clone the current repository first :

```
git clone https://github.com/ask0ldd/P13-ChatPOC.git
```

### Prerequisites

Before all you need to install these softwares, packages and librairies :

- nodejs
  ```
  https://nodejs.org/en
  ```
- npm (after installing nodejs)
  ```
  npm install -g npm
  ```
- java development kit 17 (jdk17) and if needed, add a JAVA_HOME environment variable pointing at your java installation folder.
  ```
  https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
  ```
- mysql & mysqlwork bench (full install)

  ```
  https://dev.mysql.com/downloads/windows/
  ```

- the angular cli (after installing nodejs)
  ```
  npm install -g @angular/cli
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### FrontEnd Installation

1. Open the front folder into your favorite IDE

2. Install the packages needed for the front end (node & npm should be installed first)
   ```
   npm install
   ```
3. Start the Front End of the App (npm & the angular cli should be installed first)
   ```
   npm run start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Backend Installation

1. Open the back folder into your favorite IDE

2. Install MySQL & Workbench and define a root password.

3. Create an env.properties file into the ressources folder of the project and add the following lines, with your root password replacing 'yourownrootpassword' (don't do this on a production server, create a new user with all the needed authorisations instead) :
   ```
   spring.datasource.username=root
   spring.datasource.password=yourownrootpassword
   ```
4. Open MySQL Workbench
   ```
   The following connection should already be set up :
      Local Instance MySQL80 / user : root / url : localhost:3306.
   ```
5. Create a "chatpoc" empty schema with Workbench. You don't need to do more since all the mandatory tables will be created by Spring JPA when running the project.

6. Build the project.

   ```
   mvnw package
   ```

7. Run the project with Maven.
   ```
   mvnw spring-boot:run
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->

## Usage

- Open a tab and connect as a customer using the following credentials : 

Username : guest / Password : password.

- Open a second tab and connect as an administrator using these credentials : 

Username : admin / Password : password.

- Within the second tab, as the administrator, select a customer from the queue

- Both participants can now communicate with each other.

<p align="right">(<a href="#readme-top">back to top</a>)</p>