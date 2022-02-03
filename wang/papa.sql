-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  Dim 14 juin 2020 à 19:35
-- Version du serveur :  5.7.21
-- Version de PHP :  5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `papa`
--

-- --------------------------------------------------------

--
-- Structure de la table `patient`
--

DROP TABLE IF EXISTS `patient`;
CREATE TABLE IF NOT EXISTS `patient` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `dates` varchar(255) NOT NULL,
  `heures` varchar(6) NOT NULL,
  `dioptrie` varchar(255) NOT NULL,
  `profession` varchar(255) NOT NULL,
  `edv` varchar(255) NOT NULL,
  `contact` int(255) NOT NULL,
  `age` int(255) NOT NULL,
  `sexe` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `patient`
--

INSERT INTO `patient` (`id`, `nom`, `prenom`, `dates`, `heures`, `dioptrie`, `profession`, `edv`, `contact`, `age`, `sexe`) VALUES
(6, 'alain', 'Nan', '2020-06-12', '18:01', 'nan', 'info', 'nan', 5, 12, 'Masculin'),
(7, 'alain', 'Nan', '2020-06-12', '18:01', 'nan', 'info', 'nan', 5, 12, 'Masculin'),
(8, 'alain', 'Nan', '2020-06-12', '18:01', 'nan', 'info', 'nan', 5, 12, 'Masculin'),
(9, 'alain', 'Nan', '2020-06-12', '18:01', 'nan', 'info', 'nan', 5, 12, 'Masculin'),
(10, 'alain', 'Nan', '2020-06-12', '18:01', 'nan', 'info', 'nan', 5, 12, 'Masculin'),
(13, 'nannana', 'Nan', '2020-06-12', '21:04', 'nan', 'info', 'nan', 5, 12, 'Feminin'),
(12, 'dorian', 'Nan', '2020-06-12', '21:01', 'nan', 'info', 'nan', 6548, 12, 'Masculin');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
