-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: web4
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_fname` varchar(255) DEFAULT NULL,
  `admin_lname` varchar(255) DEFAULT NULL,
  `admin_pass` varchar(255) NOT NULL,
  `birth` date NOT NULL,
  `admin_gender` enum('female','male','other') NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `admin_img` varchar(255) DEFAULT '/uploads/person.png',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Keara','Sumner','$2a$05$vjfRWnvS8mfsKsn.HJw4e.7lRDgG0xL/fkLvkcPIn7oZKdqUan49S','1997-11-11','female','ks@email.com','/uploads/admin1.png'),(2,'Drake','Symonds','$2a$05$GONaSPf.hlCk5zVZ1oklcea9WBex72OzomOEuX9uAKdGAOq.N6dgq','1998-12-12','male','ds@email.com','/uploads/admin2.png'),(3,'Raymond','Tollemache','$2a$05$hZljC/qjzE3pbrmvxuIiUur4/3z1A/sHJOTpsrjFgM2m6StHRzen6','1997-03-13','male','rt@email.com','/uploads/admin3.png'),(4,'Kassandra','Marlowe','$2a$05$epA9tZ4qXWiYyhA/Hav1zeFhIN3ToZheRqCVY4fuE8xnwCVLxMe9i','1996-06-28','female','km@email.com','/uploads/admin4.png'),(5,'Cheyenne','Dunn','$2a$05$hsDcKiWwIyIGJM8snANPDOGQ1DoB81p/aXEP40uXW2K.VaZWXkov6','1999-12-25','female','cd@email.com','/uploads/admin5.png'),(6,'Shannon','Chandler','$2a$05$gcaKHvr4Irle2evAbI9Vsu9B2yn/tGviPshLZAEUA/7BAhm7b2qUW','1996-02-14','male','sc@email.com','/uploads/admin6.png');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_course_id` int NOT NULL,
  `comment` varchar(255) NOT NULL DEFAULT '0',
  `comment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id_idx` (`comment_course_id`),
  CONSTRAINT `comment_course_id` FOREIGN KEY (`comment_course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) DEFAULT NULL,
  `course_info` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `course_price` float(8,2) DEFAULT NULL,
  `teacher_id` int NOT NULL,
  `course_des` text NOT NULL,
  `like` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`course_id`),
  KEY `teacher_id_idx` (`teacher_id`),
  CONSTRAINT `course_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'Learn Python','This course will give you a full introduction into all of the core concepts in python.','/uploads/learnpy.png','04:26:52',1990.00,1,'Python is one of the top three most popular programming languages in 2019 and everybody is learning Python either to make their life easier or to expand their job opportunities. In fact, if you want to get into data science and machine learning, Python is THE language that you must learn.',24),(2,'Psychology','What does Psychology mean? Where does it come from? Hank gives you a 10 minute intro to one of the more tricky sciences and talks about some of the big names in the development of the field. Welcome to Crash Course Psychology!!!','/uploads/psycho.png','10:54:00',1559.00,2,'Are you interested in gaining a better understanding of human behavior? Psychology is the study of the mind, one of the most complex and complex machines on our planet. Our thoughts, feelings, habits and behaviors are generated by our mind.',20),(3,'Web Design for Beginners','“How do I pick typefaces, how do I pick colors, what the heck is whitespace, and how do I position and size elements correctly?” These are exactly the kinds of questions which we’ll address in this beginner web design tutorial.','/uploads/webdesign.png','05:16:11',1999.00,3,'In this Web Design for Beginners you will learn to build Responsive Websites from Scratch. This course covers everything that you need to become a professional web designer. Then we will get in depth about HTML5 & CSS, here you will learn to code your own website from scratch. This skill will help you in developing your own website just with HTML5 & CSS3.',1),(4,'IELTS Full Course','IELTS Full Course in 10 hours - 2022\', \'Concepts are explained in a simple, digestable and logical way. Every student will be able to understand the concepts easily.','/uploads/ielts.png','09:50:04',3999.00,4,'IELTS is more than just an exam; it is an opportunity to gain access to worldclass opportunities. That’s what makes IELTS a voyage of self-empowerment. You can always rely on IDP IELTS training resources to enhance the scores. Free practice tests, courses, articles, and videos are all available through IDP to help you prepare for the IELTS exam.',0),(5,'Power Automate','Power Automate Beginner to Pro [Full Course]\', \'Power Automate is an automation tool designed for Citizen Developers to build and automate workflow processes in the cloud and/or on-premises.','/uploads/powerautomate.png','02:51:54',2999.00,6,'Power Automate allows the end-user to build basic and more complex automations. Automate approval requests, escalations, create actions and tasks driven by data. Power Automate opens up many opportunities to connect your apps and use data to drive action.',10),(6,'C++ Programming Course','C++ Programming Course - Beginner to Advanced\', \'Learn modern C++ 20 programming in this comprehensive course.','/uploads/c.png','31:07:30',2999.00,5,'C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language. It is essentially “C with Classes” making it a more powerful & feature-rich object-oriented programming language as compared to C. It can be used for developing a variety of programs ranging from simple programs to even highly complex software like browsers, games, and even operating systems. This course is  designed to teach the C++ programming language from scratch while keeping the latest standards in mind.',18),(7,'SQL- Database Programming','This video is one in a series of videos where we\'ll be looking at database management basics and SQL using the MySQL RDBMS. The course is designed for beginners to SQL and database management systems, and will introduce common database management topics.','/uploads/sql-learn.png','07:36:44',2750.00,7,'This course covers the basics of working with SQL. Work your way through the videos/articles and I\'ll teach you everything you need to know to interact with database management systems and create powerful relational databases',0),(8,'Discrete Mathematics','This is the first video in the new Discrete Math playlist.  In this video you will learn about propositions and several connectives including negations, conjunctions and disjunctions and explore their truth table values.','/uploads/discrete.png','08:41:44',2500.00,5,'Discrete mathematics is the study of mathematical structures that are countable or discrete in nature. In this course, we will deal with various types of discrete structures like graphs, groups, sets, relations, functions etc. There is no prerequisite required for this series. We are dealing with this subject from scratch and will try to cover every nook and corner possible.',0),(9,'Toeic-exam English','Learn the basics of this popular English proficiency exam, which tests your business English skills and is easier than the TOEFL and the IELTS.','/uploads/toeic.png','07:23:54',4500.00,8,'Is your English limited to \'good\' and \'bad\'? Learn how to improve your vocabulary FAST by using more advanced, descriptive adjectives. Having marked thousands of student essays, I know this one simple change can help you get a  higher score on any English exam, especially TOEIC.',0),(10,'Digital marketing','Digital Marketing Course playlist is designed to offer videos on various concepts of Digital Marketing that includes what is Digital Marketing, social media marketing, and many other videos on Digital Marketing.','/uploads/digital.png','08:33:12',2300.00,3,'The Digital Marketing course is designed to help you master the essential disciplines in digital marketing, including search engine optimization (SEO), social media, pay-per-click (PPC), conversion optimization, web analytics, content marketing, email and mobile marketing. Digital marketing is one of the world’s fastest growing disciplines, and this certification will raise your value in the marketplace and prepare you for a career in digital marketing.',0),(11,'Beginner Korean Course','This is a beginner level curriculum, and you don’t need to know anything about Korean to take your first steps into the language. ','/uploads/korean.png','10:34:24',2999.00,9,'This is a beginner level curriculum, and you don’t need to know anything about Korean to take your first steps into the language. This is the first introduction video which explains the course, as well as explains what you’ll learn and how you can get the most out of it.',1),(12,'Learn Japanese','Learn the most basic Japanese expression that you will need in work, travel. A native Japanese teacher will explain the simple phrases necessary.','/uploads/japan.png','11:51:56',2999.00,10,'Learn the most basic Japanese expression that you will need in work, travel, or just for fun - how to introduce yourself. A native Japanese teacher will explain the simple phrases necessary. They\'re written in both Japanese characters and the alphabet, giving all the tools you need to get started in your Japanese study.',0),(13,'Calculus Basic','In this videos, we are going to understand the basic concepts of Calculus - Limits, Differentiation, Integration.','/uploads/calculus.png','05:12:59',1999.00,5,'Take free online calculus courses to build your math skills and improve your performance in school and at work. Learn calculus, precalculus, algebra and other math subjects with courses from top universities and institutions around the world.',0),(14,'Design thinking','In this design thinking tutorial, we will be looking at what is design thinking, why design thing is important. It is extremely helpful in solving problems that are ill-defined or unknown.','/uploads/design-thinking.png','04:44:24',2300.00,6,'This Design Thinking Course lets you master the concepts of design thinking—a powerful problem-solving process that involves a deep understanding of customer needs. You can boost your grasp of business strategy and innovation to drive a design thinking culture in your organization with the help of this Design Thinking Training.',12),(15,'Cyber Security','Cyber Security Full Course  will help you understand and learn the fundamentals of Cyber Security.','/uploads/cyber-secure.png','06:42:27',2250.00,3,'This Cyber Security Course will help you in learning about the basic concepts of Cybersecurity along with the methodologies that must be practiced ensuring information security of an organization. Starting from the Ground level Security Essentials, this course will lead you through Cryptography, Computer Networks & Security, Application Security, Cloud Security, Cyber-Attacks and various security practices for businesses.',1),(28,'HELLO CAT 101','Cat say meow.','/uploads/course_image-1676123909890.jpeg','03:20:10',1900.00,12,'Cats, like people, have unique personalities and characteristics. Therefore, there is no definitive list of “normal” cat behavior. While there are many common feline behaviors, keep in mind that each cat is special and may act in ways that are slightly different due to their personality, environment or mood. For example, the most common cat behaviors include purring, grooming, kneading and climbing. But each cat will engage in these activities differently. Pay attention to your cat’s behavior and determine what is “normal” for your cat so you can be aware of unusual behavior that may require a trip to the vet.',2);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_image`
--

DROP TABLE IF EXISTS `course_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_image` (
  `course_no` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`course_no`,`course_id`),
  KEY `course_id_idx` (`course_id`),
  CONSTRAINT `course_image_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_image`
--

LOCK TABLES `course_image` WRITE;
/*!40000 ALTER TABLE `course_image` DISABLE KEYS */;
INSERT INTO `course_image` VALUES (1,'/uploads/learnpy.png',1),(2,'/uploads/psycho.png',2),(3,'/uploads/webdesign.png',3),(4,'/uploads/ielts.png',4),(5,'/uploads/powerautomate.png',5),(6,'/uploads/c.png',6),(7,'/uploads/sql-learn.png',7),(8,'/uploads/discrete.png',8),(9,'/uploads/toeic.png',9),(10,'/uploads/digital.png',10),(11,'/uploads/korean.png',11),(12,'/uploads/japan.png',12),(13,'/uploads/calculus.png',13),(14,'/uploads/design-thinking.png',14),(15,'/uploads/cyber-secure.png',15);
/*!40000 ALTER TABLE `course_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `my_course`
--

DROP TABLE IF EXISTS `my_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `my_course` (
  `my_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`my_id`),
  KEY `order_id_idx` (`order_id`),
  KEY `course_id_idx` (`course_id`),
  CONSTRAINT `course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `my_course`
--

LOCK TABLES `my_course` WRITE;
/*!40000 ALTER TABLE `my_course` DISABLE KEYS */;
INSERT INTO `my_course` VALUES (113,38,2),(114,38,1);
/*!40000 ALTER TABLE `my_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `my_video`
--

DROP TABLE IF EXISTS `my_video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `my_video` (
  `video_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`video_id`),
  KEY `course_id_idx` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `my_video`
--

LOCK TABLES `my_video` WRITE;
/*!40000 ALTER TABLE `my_video` DISABLE KEYS */;
INSERT INTO `my_video` VALUES (1,1,'https://www.youtube.com/embed/Y8Tko2YC5hA?list=PLTjRvDozrdlxj5wgH4qkvwSOdHLOCx10f'),(2,1,'https://www.youtube.com/embed/ODjFDZC_TyA?list=PLTjRvDozrdlxj5wgH4qkvwSOdHLOCx10f'),(3,1,'https://www.youtube.com/embed/94UHCEmprCY?list=PLTjRvDozrdlxj5wgH4qkvwSOdHLOCx10f'),(4,1,'https://www.youtube.com/embed/u-OmVr_fT4s?list=PLTjRvDozrdlxj5wgH4qkvwSOdHLOCx10f'),(5,1,'https://www.youtube.com/embed/9OeznAkyQz4?list=PLTjRvDozrdlxj5wgH4qkvwSOdHLOCx10f'),(6,1,'https://www.youtube.com/embed/Ctqi5Y4X-jA?list=PLTjRvDozrdlxj5wgH4qkvwSOdHLOCx10f'),(7,1,'https://www.youtube.com/embed/t9j8lCUGZXo?list=PLTjRvDozrdlxj5wgH4qkvwSOdHLOCx10f'),(8,2,'https://www.youtube.com/embed/vo4pMVb0R6M?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6'),(9,2,'https://www.youtube.com/embed/hFV71QPvX2I?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6'),(10,2,'https://www.youtube.com/embed/W4N-7AlzK7s?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6'),(11,2,'https://www.youtube.com/embed/vHrmiy4W9C0?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6'),(12,2,'https://www.youtube.com/embed/unWnZvXJH2o?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6'),(13,2,'https://www.youtube.com/embed/fxZWtc0mYpQ?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6'),(14,2,'https://www.youtube.com/embed/n46umYA_4dM?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6'),(15,3,'https://www.youtube.com/embed/TDRhwSfxYkg?list=PLXC_gcsKLD6n7p6tHPBxsKjN5hA_quaPI'),(16,3,'https://www.youtube.com/embed/UuPt4RpV4Xc?list=PLXC_gcsKLD6n7p6tHPBxsKjN5hA_quaPI'),(17,3,'https://www.youtube.com/embed/Cn2KgB_01mE?list=PLXC_gcsKLD6n7p6tHPBxsKjN5hA_quaPI'),(18,3,'https://www.youtube.com/embed/ZliIs7jHi1s?list=PLXC_gcsKLD6n7p6tHPBxsKjN5hA_quaPI'),(19,3,'https://www.youtube.com/embed/FYOxoJbngAM?list=PLXC_gcsKLD6n7p6tHPBxsKjN5hA_quaPI'),(20,3,'https://www.youtube.com/embed/x3Yno9VUYBY?list=PLXC_gcsKLD6n7p6tHPBxsKjN5hA_quaPI'),(21,3,'https://www.youtube.com/embed/BN8pC91rJaU?list=PLXC_gcsKLD6n7p6tHPBxsKjN5hA_quaPI'),(22,4,'https://www.youtube.com/embed/iC11QuIT5BE?list=PLfSUFKdFlttn1MWrG5Q0-a9Cbm9y3uulX'),(23,4,'https://www.youtube.com/embed/ebePuOqlGDA?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(24,4,'https://www.youtube.com/embed/e10E1GXcvmI?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(25,4,'https://www.youtube.com/embed/OyfRLYdmbEc?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(26,4,'https://www.youtube.com/embed/mf7lUcl-eZ4?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(27,4,'https://www.youtube.com/embed/871IXLebyN4?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(28,4,'https://www.youtube.com/embed/871IXLebyN4?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(29,5,'https://www.youtube.com/embed/WXlFJvUZ3D8?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(30,5,'https://www.youtube.com/embed/ebePuOqlGDA?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(31,5,'https://www.youtube.com/embed/e10E1GXcvmI?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(32,5,'https://www.youtube.com/embed/OyfRLYdmbEc?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(33,5,'https://www.youtube.com/embed/mf7lUcl-eZ4?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(34,5,'https://www.youtube.com/embed/871IXLebyN4?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(35,5,'https://www.youtube.com/embed/-YxgtW1KmYc?list=PLZVSOFwGx4zDK7apie3GqgfX6Tu2kmpMA'),(36,6,'https://www.youtube.com/embed/s0g4ty29Xgg?list=PLBlnK6fEyqRh6isJ01MBnbNpV3ZsktSyS'),(37,6,'https://www.youtube.com/embed/imNlJohlLPk?list=PLBlnK6fEyqRh6isJ01MBnbNpV3ZsktSyS'),(38,6,'https://www.youtube.com/embed/cnMziyeusQk?list=PLBlnK6fEyqRh6isJ01MBnbNpV3ZsktSyS'),(39,6,'https://www.youtube.com/embed/1Wrc91mp980?list=PLBlnK6fEyqRh6isJ01MBnbNpV3ZsktSyS'),(40,6,'https://www.youtube.com/embed/ZZWTh142s4w?list=PLBlnK6fEyqRh6isJ01MBnbNpV3ZsktSyS'),(41,6,'https://www.youtube.com/embed/iF4i423144E?list=PLBlnK6fEyqRh6isJ01MBnbNpV3ZsktSyS'),(42,6,'https://www.youtube.com/embed/yS8DUrQy_ow?list=PLBlnK6fEyqRh6isJ01MBnbNpV3ZsktSyS'),(43,7,'https://www.youtube.com/embed/_Q07-8e3UbI?list=PLLAZ4kZ9dFpMGXTKXsBM_ZNpJwowfsP49'),(44,7,'https://www.youtube.com/embed/uw6lx3R6q5A?list=PLLAZ4kZ9dFpMGXTKXsBM_ZNpJwowfsP49'),(45,7,'https://www.youtube.com/embed/SPPTQwx4FfE?list=PLLAZ4kZ9dFpMGXTKXsBM_ZNpJwowfsP49'),(46,7,'https://www.youtube.com/embed/3Qq93zqO3GE?list=PLLAZ4kZ9dFpMGXTKXsBM_ZNpJwowfsP49'),(47,7,'https://www.youtube.com/embed/9WP35xwZ3tk?list=PLLAZ4kZ9dFpMGXTKXsBM_ZNpJwowfsP49'),(48,7,'https://www.youtube.com/embed/rT7BhXLfhds?list=PLLAZ4kZ9dFpMGXTKXsBM_ZNpJwowfsP49'),(49,7,'https://www.youtube.com/embed/xfHqi11gjyg?list=PLLAZ4kZ9dFpMGXTKXsBM_ZNpJwowfsP49'),(50,8,'https://www.youtube.com/embed/p2b2Vb-cYCs?list=PLBlnK6fEyqRhqJPDXcvYlLfXPh37L89g3'),(51,8,'https://www.youtube.com/embed/IZpvlR5J7FQ?list=PLBlnK6fEyqRhqJPDXcvYlLfXPh37L89g3'),(52,8,'https://www.youtube.com/embed/6kYngPvoGxU?list=PLBlnK6fEyqRhqJPDXcvYlLfXPh37L89g3'),(53,8,'https://www.youtube.com/embed/dsByaZZYXGw?list=PLBlnK6fEyqRhqJPDXcvYlLfXPh37L89g3'),(54,8,'https://www.youtube.com/embed/ehKd3KmIRSw?list=PLBlnK6fEyqRhqJPDXcvYlLfXPh37L89g3'),(55,8,'https://www.youtube.com/embed/8octtUkdv4Y?list=PLBlnK6fEyqRhqJPDXcvYlLfXPh37L89g3'),(56,8,'https://www.youtube.com/embed/f5Iy1V3lgFs?list=PLBlnK6fEyqRhqJPDXcvYlLfXPh37L89g3'),(57,9,'https://www.youtube.com/embed/o6giEajfcpQ?list=PLrgVJRYH4Ho54cxynScMOYosx2kmSMzzQ'),(58,9,'https://www.youtube.com/embed/5SqUrWZwIno?list=PLrgVJRYH4Ho54cxynScMOYosx2kmSMzzQ'),(59,9,'https://www.youtube.com/embed/BfrqPlTtHlA?list=PLrgVJRYH4Ho54cxynScMOYosx2kmSMzzQ'),(60,9,'https://www.youtube.com/embed/eFTSJbWPxF8?list=PLrgVJRYH4Ho54cxynScMOYosx2kmSMzzQ'),(61,9,'https://www.youtube.com/embed/gCv3RSkJtRM?list=PLrgVJRYH4Ho54cxynScMOYosx2kmSMzzQ'),(62,9,'https://www.youtube.com/embed/eUbEIIxxl_s?list=PLrgVJRYH4Ho54cxynScMOYosx2kmSMzzQ'),(63,9,'https://www.youtube.com/embed/ysipXK2TZlY?list=PLrgVJRYH4Ho54cxynScMOYosx2kmSMzzQ'),(64,10,'https://www.youtube.com/embed/8ZOfPh4OwOQ?list=PLEiEAq2VkUULa5aOQmO_al2VVmhC-eqeI'),(65,10,'https://www.youtube.com/embed/wUtqAOgfP6c?list=PLEiEAq2VkUULa5aOQmO_al2VVmhC-eqeI'),(66,10,'https://www.youtube.com/embed/z3CEHPsxkwQ?list=PLEiEAq2VkUULa5aOQmO_al2VVmhC-eqeI'),(67,10,'https://www.youtube.com/embed/0Uowv0cXWOI?list=PLEiEAq2VkUULa5aOQmO_al2VVmhC-eqeI'),(68,10,'https://www.youtube.com/embed/9qfKppGr2Uo?list=PLEiEAq2VkUULa5aOQmO_al2VVmhC-eqeI'),(69,10,'https://www.youtube.com/embed/9qfKppGr2Uo?list=PLEiEAq2VkUULa5aOQmO_al2VVmhC-eqeI'),(70,10,'https://www.youtube.com/embed/HZ2BA4RKnsw?list=PLEiEAq2VkUULa5aOQmO_al2VVmhC-eqeI'),(71,11,'https://www.youtube.com/embed/U49SJ-evntU?list=PLbFrQnW0BNMUkAFj4MjYauXBPtO3I9O_k'),(72,11,'https://www.youtube.com/embed/YzpwHrA_iQQ?list=PLbFrQnW0BNMUkAFj4MjYauXBPtO3I9O_k'),(73,11,'https://www.youtube.com/embed/VZLo2lSjCsM?list=PLbFrQnW0BNMUkAFj4MjYauXBPtO3I9O_k'),(74,11,'https://www.youtube.com/embed/ntyAHtIIw1A?list=PLbFrQnW0BNMUkAFj4MjYauXBPtO3I9O_k'),(75,11,'https://www.youtube.com/embed/ID4gPRoN5OE?list=PLbFrQnW0BNMUkAFj4MjYauXBPtO3I9O_k'),(76,11,'https://www.youtube.com/embed/uXZTSNNCBBU?list=PLbFrQnW0BNMUkAFj4MjYauXBPtO3I9O_k'),(77,11,'https://www.youtube.com/embed/R8_uri5EZzs?list=PLbFrQnW0BNMUkAFj4MjYauXBPtO3I9O_k'),(78,12,'https://www.youtube.com/embed/hMDIHYHOggE?list=PLF97A549D60C2EBA4'),(79,12,'https://www.youtube.com/embed/uU5lkWqcdm0?list=PLF97A549D60C2EBA4'),(80,12,'https://www.youtube.com/embed/URabOUUDMwA?list=PLF97A549D60C2EBA4'),(81,12,'https://www.youtube.com/embed/21ifvoxZhrg?list=PLF97A549D60C2EBA4'),(82,12,'https://www.youtube.com/embed/2WEfJ2zBFqs?list=PLF97A549D60C2EBA4'),(83,12,'https://www.youtube.com/embed/Ifs15Na083Y?list=PLF97A549D60C2EBA4'),(84,12,'https://www.youtube.com/embed/T2SvdeRs0L8?list=PLF97A549D60C2EBA4'),(85,13,'https://www.youtube.com/embed/OzL5d2GBUWI?list=PLl-gb0E4MII1ml6mys-RXoQ0O3GfwBPVM'),(86,13,'https://www.youtube.com/embed/2hwdlWPoaUE?list=PLl-gb0E4MII1ml6mys-RXoQ0O3GfwBPVM'),(87,13,'https://www.youtube.com/embed/Niw3wBg6RPE?list=PLl-gb0E4MII1ml6mys-RXoQ0O3GfwBPVM'),(88,13,'https://www.youtube.com/embed/hbiX_8jPtB0?list=PLl-gb0E4MII1ml6mys-RXoQ0O3GfwBPVM'),(89,13,'https://www.youtube.com/embed/8TcwW0mhdAY?list=PLl-gb0E4MII1ml6mys-RXoQ0O3GfwBPVM'),(90,13,'https://www.youtube.com/embed/OPb0EuFmBOU?list=PLl-gb0E4MII1ml6mys-RXoQ0O3GfwBPVM'),(91,13,'https://www.youtube.com/embed/yLMDOV9EXWY?list=PLl-gb0E4MII1ml6mys-RXoQ0O3GfwBPVM'),(92,14,'https://www.youtube.com/embed/jT95e2ycu9I?list=PLEiEAq2VkUUIz01StTtLRDtXwNVwjj-Nc'),(93,14,'https://www.youtube.com/embed/jT95e2ycu9I?list=PLEiEAq2VkUUIz01StTtLRDtXwNVwjj-Nc'),(94,14,'https://www.youtube.com/embed/HInixSID4gg?list=PLEiEAq2VkUUIz01StTtLRDtXwNVwjj-Nc'),(95,14,'https://www.youtube.com/embed/WT7wl8Wbgo8?list=PLEiEAq2VkUUIz01StTtLRDtXwNVwjj-Nc'),(96,14,'https://www.youtube.com/embed/b0Q1XZp-YTo?list=PLEiEAq2VkUUIz01StTtLRDtXwNVwjj-Nc'),(97,14,'https://www.youtube.com/embed/lovNaojdXYY?list=PLrBU7Mcq5Jxxv9_cgEOjSyw6fUSpdKpLV'),(98,14,'https://www.youtube.com/embed/Hc899qz42PQ?list=PLrBU7Mcq5Jxxv9_cgEOjSyw6fUSpdKpLV'),(99,15,'https://www.youtube.com/embed/ooJSgsB5fIE?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_'),(100,15,'https://www.youtube.com/embed/uk8-jJgu8-I?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_'),(101,15,'https://www.youtube.com/embed/_QtSB0Old_Q?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_'),(102,15,'https://www.youtube.com/embed/KgtevibJlTE?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_'),(103,15,'https://www.youtube.com/embed/Sj4TD0LSC_k?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_'),(104,15,'https://www.youtube.com/embed/Dk-ZqQ-bfy4?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_'),(105,15,'https://www.youtube.com/embed/d30n-YxOHo4?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_'),(106,22,'https://www.youtube.com/embed/ZJaKdBBzUYk'),(107,22,'https://www.youtube.com/embed/ZJaKdBBzUYk'),(108,22,'https://www.youtube.com/embed/ZJaKdBBzUYk'),(109,25,'https://www.youtube.com/embed/jEPzuU8Iad0'),(110,25,'https://www.youtube.com/embed/jEPzuU8Iad0'),(111,25,'https://www.youtube.com/embed/jEPzuU8Iad0'),(112,25,'https://www.youtube.com/embed/jEPzuU8Iad0');
/*!40000 ALTER TABLE `my_video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_status` enum('complete','pending') DEFAULT 'pending',
  `order_date` date DEFAULT NULL,
  `price_total` float(8,2) DEFAULT NULL,
  `user_id` int NOT NULL,
  `admin_id` int NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `admin_id_idx` (`admin_id`),
  CONSTRAINT `order_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`),
  CONSTRAINT `order_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (38,'complete','2023-02-11',3549.00,17,5);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `item_no` int NOT NULL AUTO_INCREMENT,
  `item_price` float(8,2) DEFAULT NULL,
  `course_id` int NOT NULL,
  `order_id` int NOT NULL,
  PRIMARY KEY (`item_no`,`order_id`),
  KEY `course_id_idx` (`course_id`),
  KEY `order_id_idx` (`order_id`),
  CONSTRAINT `item_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `item_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `payment_account` varchar(255) DEFAULT NULL,
  `payment_slip` varchar(255) DEFAULT NULL,
  `order_id` int NOT NULL,
  `status_payment` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`payment_id`),
  KEY `order_id_idx` (`order_id`),
  CONSTRAINT `payment_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (44,'qrcode','/uploads/slip-1676122660226.jpeg',38,1);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preview`
--

DROP TABLE IF EXISTS `preview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preview` (
  `preview_id` int NOT NULL AUTO_INCREMENT,
  `preview_info` text,
  `course_id` int NOT NULL,
  `preview_img` varchar(255) DEFAULT NULL,
  `learn1` varchar(255) DEFAULT NULL,
  `learn2` varchar(255) DEFAULT NULL,
  `learn3` varchar(255) DEFAULT NULL,
  `learn4` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`preview_id`),
  KEY `course_id_idx` (`course_id`),
  CONSTRAINT `preview_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preview`
--

LOCK TABLES `preview` WRITE;
/*!40000 ALTER TABLE `preview` DISABLE KEYS */;
INSERT INTO `preview` VALUES (1,'This course will give you a full introduction into all of the core concepts in python.',1,'/uploads/preview1.png','What is Python?','What can you do with Python?','How to learn Python?','What kind of applications can you build with Python?'),(2,'What does Psychology mean? Where does it come from? Hank gives you a 10 minute intro to one of the more tricky sciences and talks about some of the big names in the development of the field. Welcome to Crash Course Psychology!!!',2,'/uploads/preview2.png','What is Psychology?','Case Studies','Psychological & Biological','Perchance to Dream'),(3,'“How do I pick typefaces, how do I pick colors, what the heck is whitespace, and how do I position and size elements correctly?” These are exactly the kinds of questions which we’ll address in this beginner web design tutorial.',3,'/uploads/preview3.png','Basic Web Design','Color Theory','Website Structor','UX/UI practice'),(4,'Concepts are explained in a simple, digestable and logical way. Every student will be able to understand the concepts easily.',4,'/uploads/preview4.png','Detailed Understanding of IELTS test format','Writing for Essay','Speaking Practice','IELTS Listening'),(5,'Power Automate Beginner to Pro [Full Course], Power Automate is an automation tool designed for Citizen Developers to build and automate workflow processes in the cloud and/or on-premises.',5,'/uploads/preview5.png','Download and Install','Quick Look','Excel Automation','Database'),(6,'Learn modern C++ 20 programming in this comprehensive course.',6,'/uploads/preview6.png','Basic introduction to C++.','C++: An extension of C.','Prerequisites.','Syllabus to be covered in the course.'),(7,'This video is one in a series of videos where we\'ll be looking at database management basics and SQL using the MySQL RDBMS. The course is designed for beginners to SQL and database management systems, and will introduce common database management topics.',7,'/uploads/preview7.png','What is a Database?','Tables & Keys','SQL Basics','Basic Queries'),(8,'This is the first video in the new Discrete Math playlist.  In this video you will learn about propositions and several connectives including negations, conjunctions and disjunctions and explore their truth table values.',8,'/uploads/preview8.png','What is Discrete Mathematics?','What is the need to study Discrete Math?','Discrete vs. continuous objects.','Syllabus of Discrete Mathematics.'),(9,'Learn the basics of this popular English proficiency exam, which tests your business English skills and is easier than the TOEFL and the IELTS.',9,'/uploads/preview9.png','Grammar','Memory Techniques','Vocubulary','Update new tests every year.'),(10,'Digital Marketing Course playlist is designed to offer videos on various concepts of Digital Marketing that includes what is Digital Marketing, social media marketing, and many other videos on Digital Marketing.',10,'/uploads/preview10.png','Digital Marketing','Marketing Analytics','IoT Marketing','Customer Lifecycle Management'),(11,'This is a beginner level curriculum, and you don’t need to know anything about Korean to take your first steps into the language. ',11,'/uploads/preview11.png','Learning 한글','Basic Conversation','Counting Number','Sentence Structure'),(12,'Learn the most basic Japanese expression that you will need in work, travel. A native Japanese teacher will explain the simple phrases necessary.',12,'/uploads/preview12.png','Basic Conversation','Pop Culture Words','Colors','Handy Words'),(13,'In this videos, we are going to understand the basic concepts of Calculus - Limits, Differentiation, Integration.',13,'/uploads/preview13.png','Limits And Their Properties','Differentiation','Integration','Function'),(14,'In this design thinking tutorial, we will be looking at what is design thinking, why design thing is important. It is extremely helpful in solving problems that are ill-defined or unknown.',14,'/uploads/preview14.png','Introduction To Design Thinking','How to identify problems','Define requirements','Ideate workshops'),(15,'Cyber Security Full Course  will help you understand and learn the fundamentals of Cyber Security.',15,'/uploads/preview15.png','What Is Cybersecurity?','Popular Use cases of Cybersecurity','Career Prospects in Cybersecurity','Most Common Cybersecurity'),(28,'Cat say meow.',28,'/uploads/preview_image-1676123909897.jpeg','Popular cat names','Dog–cat relationship','Cat lover culture','Cat Behavior');
/*!40000 ALTER TABLE `preview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preview_preview_video`
--

DROP TABLE IF EXISTS `preview_preview_video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preview_preview_video` (
  `preview_no` int NOT NULL AUTO_INCREMENT,
  `preview_video` varchar(255) DEFAULT NULL,
  `preview_id` int NOT NULL,
  PRIMARY KEY (`preview_no`,`preview_id`),
  KEY `preview_id_idx` (`preview_id`),
  CONSTRAINT `preview_preview_id` FOREIGN KEY (`preview_id`) REFERENCES `preview` (`preview_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preview_preview_video`
--

LOCK TABLES `preview_preview_video` WRITE;
/*!40000 ALTER TABLE `preview_preview_video` DISABLE KEYS */;
INSERT INTO `preview_preview_video` VALUES (1,'https://www.youtube.com/embed/Y8Tko2YC5hA',1),(2,'https://www.youtube.com/embed/eal4-A89IWY?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6',2),(3,'https://www.youtube.com/embed/IbOyBIS57C0',3),(4,'https://www.youtube.com/embed/_HvWub-87NQ?list=PLfSUFKdFlttn1MWrG5Q0-a9Cbm9y3uulX',4),(5,'https://www.youtube.com/embed/ITrICV7EtlE',5),(6,'https://www.youtube.com/embed/s0g4ty29Xgg?list=PLBlnK6fEyqRh6isJ01MBnbNpV3ZsktSyS',6),(7,'https://www.youtube.com/embed/xmwI6VB_wUM?list=PLLAZ4kZ9dFpMGXTKXsBM_ZNpJwowfsP49',7),(8,'https://www.youtube.com/embed/p2b2Vb-cYCs',8),(9,'https://www.youtube.com/embed/jVsUkmKk2uQ?list=PLrgVJRYH4Ho54cxynScMOYosx2kmSMzzQ',9),(10,'https://www.youtube.com/embed/bixR-KIJKYM',10),(11,'https://www.youtube.com/embed/sx0yyQqkpqo?list=PLbFrQnW0BNMUkAFj4MjYauXBPtO3I9O_k',11),(12,'https://www.youtube.com/embed/eSrpkd8X4MQ?list=PLF97A549D60C2EBA4',12),(13,'https://www.youtube.com/embed/8NIsIW5nf4Y?list=PLl-gb0E4MII1ml6mys-RXoQ0O3GfwBPVM',13),(14,'https://www.youtube.com/embed/j7K7-W82hcE?list=PLEiEAq2VkUUIz01StTtLRDtXwNVwjj-Nc',14),(15,'https://www.youtube.com/embed/GT0daScxO18?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_',15),(28,'https://www.youtube.com/embed/YSHDBB6id4A',28);
/*!40000 ALTER TABLE `preview_preview_video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `teacher_fname` varchar(255) DEFAULT NULL,
  `teacher_lname` varchar(255) DEFAULT NULL,
  `teacher_image` varchar(255) DEFAULT '/uploads/person.png',
  `teacher_des` text,
  `position` varchar(255) DEFAULT 'Teacher',
  PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,'Thomas','Jenkins','/uploads/teacher1.png','Hi, I’m Thomas Jenkins, I\'m Assistant Professor of Software Engineering at University Reading. I love programming languages and distributed systems, but I also really enjoy reading books about programming languages and distributed systems.','Software engineer'),(2,'Matthew','Carter','/uploads/teacher2.png','I\'m Matthew, I work with young people and families to help them create a resilience mindset, navigate the social media gauntlet, and raise their self-confidence in meaningful ways. I teach mindfulness – a very effective tool for reducing stress and anxiety.','Computer scientist & Psychologist'),(3,'Andrew','Anderson','/uploads/teacher3.png','Hello, I\'m Andrew Anderson,I\'m a developer with a passion for teaching. I like solving problems. I like coding. My reality is code, my language is code. I live in my cloud server with my services and APIs, building apps with the best technology stack.','Web developer & Network engineer'),(4,'Eric','Brown','/uploads/teacher4.png','My name’s Eric Brown.Teaching is my passion & it’s truly one of the most rewarding jobs out there. Students are my favourite people. I love teaching them important concepts in a way that allows them to really understand, in-depth.','Online tutor & Book Writer'),(5,'Mark','Burton','/uploads/teacher5.png','Hi, I\'m Mark Burton.Being a math teacher means teaching problem-solving, critical thinking and analysis skills. This demands creativity and adaptability in the classroom, which makes classes interesting every day. As I discover each student’s learning style and help them acquire and improve.','Data Analyst'),(6,'Peter','Palmer','/uploads/teacher6.png','I\'m Peter Palmer.Designing a customer experience is a little like DJing, both rely on a good sense of rhythm. As a user experience designer, I’m responsible for everything that happens within a second on an app or webpage, from making sure new users know what.','Systems analyst'),(7,'Mike','Dane','/uploads/teacher7.png','Hi, I am Mike Dane, an Computer Systems Analyst. Currently I am working in an esteemed institution in Pakistan.I have multiple years of experience in teaching Cambridge O and A levels. Furthermore I have experience in teaching Computer Engineering related subjects such as Information System Analysis and Design, Database system, Intro to Programing etc.','Computer Systems Analyst'),(8,'KruDew','Opendurian','/uploads/teacher8.png','Hello, I am KruDew from Opendurian. I\'m in love with my job and want to motivate everyone around to fall in love with English with me. I have been in this field for over 10 years. During this time, I managed to understand how to make language learning really interesting and productive.','Online tutor & Lecturer'),(9,'Billy','Go','/uploads/teacher9.png','I’m Billy from GO! Billy Korean, and I teach Korean online. I love the Korean language, and I visit South Korea each year.I pour all of my free time into making new videos, lessons, and content for learning Korean.','Online tutor'),(10,'Konomi','Miyamoto','/uploads/teacher10.png','Hi. My name is Konomi, I am Japanese, I live in USA and I specialize in teaching Japanese to children, beginners and advanced learners. Let\'s enjoy talking in Japanese with me.','Online tutor'),(11,'Albus','Dumbledore','/uploads/person.png',NULL,'Teacher'),(12,'Test','Teacher','/uploads/image-1676124133551.jpeg',NULL,'Teacher');
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tokenl_UNIQUE` (`token`),
  KEY `tokens_user_id_idx` (`user_id`),
  CONSTRAINT `tokens_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (10,17,'x^w0!YZ$$sq9D2oWvmM5@qsJ*rD06t@^Vd=mghgHOR/ONaL#FeUtkendjICflfA!wj^KdkJ^Duw$X6m=L#*g*8wRkact/r6VuhBR'),(11,18,'X&5J$T87X$--P3T0ljdfRhlw7/mYZoC@kaFCrelWWYmZU2NzBPl@@zhukbA@-4a$WqR2zgzwZCZsnarjk0EGtnBT$df75vOdHkfg');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_fname` varchar(255) DEFAULT NULL,
  `user_lname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` enum('female','male','other') NOT NULL,
  `status_user` enum('off','on') NOT NULL,
  `dateofbirth` date NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT '/uploads/person.png',
  `role` enum('student','teacher') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (17,'Test','User','test@gmail.com','male','off','1999-01-01','$2b$05$04ZRYyYFJEklB77KOTu.8.q36t4ZurBaAL88CAzTtTFIF0UPZSjTy','/uploads/image-1676122537380.jpeg','student'),(18,'Test','Teacher','teacher@gmail.com','female','on','1980-12-25','$2b$05$mcCbA36ZDk5U/zfDRrJdXeEo7kow2JeHpD//jOHMyCz35DZeSrDjq','/uploads/image-1676124133551.jpeg','teacher');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-11 21:22:56
