

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `infirmerie`
--

-- --------------------------------------------------------

--
-- Structure de la table `consulte`
--

CREATE TABLE IF NOT EXISTS `consulte` (
  `id_malade` int(11) NOT NULL AUTO_INCREMENT,
  `id_medecins` int(11) NOT NULL,
  `obsevation_consult` text,
  `frais_consultation` int(11) DEFAULT NULL,
  `date_consultation` date DEFAULT NULL,
  PRIMARY KEY (`id_malade`,`id_medecins`),
  KEY `FK_consulte_id_medecins` (`id_medecins`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `consulte`
--

INSERT INTO `consulte` (`id_malade`, `id_medecins`, `obsevation_consult`, `frais_consultation`, `date_consultation`) VALUES
(2, 1, 'waou', 1000, '2018-03-22'),
(3, 2, '                  le patient se plain des douleurs', 50000, '2018-03-22');

-- --------------------------------------------------------

--
-- Structure de la table `laboratoire`
--

CREATE TABLE IF NOT EXISTS `laboratoire` (
  `id_labo` int(11) NOT NULL AUTO_INCREMENT,
  `type_examen` varchar(50) DEFAULT NULL,
  `observation_labo` text,
  `date_examen` date DEFAULT NULL,
  `frais_examen` int(11) DEFAULT NULL,
  `malade_id_malade` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_labo`),
  KEY `FK_LABORATOIRE_malade_id_malade` (`malade_id_malade`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `laboratoire`
--

INSERT INTO `laboratoire` (`id_labo`, `type_examen`, `observation_labo`, `date_examen`, `frais_examen`, `malade_id_malade`) VALUES
(1, 'simple', 'manque de sang', '2018-03-23', 50000, 1),
(2, 'grave', 'magnifique', '2018-03-23', 40000, 2);

-- --------------------------------------------------------

--
-- Structure de la table `malade`
--

CREATE TABLE IF NOT EXISTS `malade` (
  `id_malade` int(11) NOT NULL AUTO_INCREMENT,
  `nom_malade` varchar(50) DEFAULT NULL,
  `prenom_malade` varchar(50) DEFAULT NULL,
  `sexe_malade` varchar(2) DEFAULT NULL,
  `adr_malade` varchar(50) DEFAULT NULL,
  `temperature` varchar(15) DEFAULT NULL,
  `poids` float DEFAULT NULL,
  PRIMARY KEY (`id_malade`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `malade`
--

INSERT INTO `malade` (`id_malade`, `nom_malade`, `prenom_malade`, `sexe_malade`, `adr_malade`, `temperature`, `poids`) VALUES
(1, 'sylla', 'thierno', 'M', 'dixin', '50', 70),
(2, 'baldé', 'diallo', 'F', 'matoto', '45', 90),
(3, 'bangooura', 'gasim', 'M', 'dixin', '78', 100),
(4, 'diallo', 'thierno', 'M', 'bambeto', '15', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `medecins`
--

CREATE TABLE IF NOT EXISTS `medecins` (
  `id_medecins` int(11) NOT NULL AUTO_INCREMENT,
  `nom_medecins` varchar(50) DEFAULT NULL,
  `prenom_medecins` varchar(50) DEFAULT NULL,
  `sexe_medecins` varchar(2) DEFAULT NULL,
  `adr_medecins` varchar(50) DEFAULT NULL,
  `tel_medecins` varchar(12) DEFAULT NULL,
  `fonction_medecins` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_medecins`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `medecins`
--

INSERT INTO `medecins` (`id_medecins`, `nom_medecins`, `prenom_medecins`, `sexe_medecins`, `adr_medecins`, `tel_medecins`, `fonction_medecins`) VALUES
(1, 'diallo', 'thierno', 'M', 'koloma', '6649904433', 'conakry'),
(2, 'barry', 'hawa', 'F', 'koloma', '626457891', 'dioe');

-- --------------------------------------------------------

--
-- Structure de la table `traitement`
--

CREATE TABLE IF NOT EXISTS `traitement` (
  `id_trai` int(11) NOT NULL AUTO_INCREMENT,
  `nom_maladie` text,
  `date_debut_trait` date DEFAULT NULL,
  `date_fin_trait` date DEFAULT NULL,
  `frais_trait` int(11) DEFAULT NULL,
  `etat_patient` varchar(50) DEFAULT NULL,
  `malade_id_malade` int(11) DEFAULT NULL,
  `medicament_prescrit` text NOT NULL,
  PRIMARY KEY (`id_trai`),
  KEY `FK_TRAITEMENT_malade_id_malade` (`malade_id_malade`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `traitement`
--

INSERT INTO `traitement` (`id_trai`, `nom_maladie`, `date_debut_trait`, `date_fin_trait`, `frais_trait`, `etat_patient`, `malade_id_malade`, `medicament_prescrit`) VALUES
(1, 'palu', '2018-03-22', '2018-03-23', 50000, 'stable', 1, 'parcetamol,quine'),
(2, '                  jun', '2018-03-22', '2018-03-22', 50000, 'st', 2, '                  de');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `consulte`
--
ALTER TABLE `consulte`
  ADD CONSTRAINT `FK_consulte_id_malade` FOREIGN KEY (`id_malade`) REFERENCES `malade` (`id_malade`),
  ADD CONSTRAINT `FK_consulte_id_medecins` FOREIGN KEY (`id_medecins`) REFERENCES `medecins` (`id_medecins`);

--
-- Contraintes pour la table `laboratoire`
--
ALTER TABLE `laboratoire`
  ADD CONSTRAINT `FK_LABORATOIRE_malade_id_malade` FOREIGN KEY (`malade_id_malade`) REFERENCES `malade` (`id_malade`);

--
-- Contraintes pour la table `traitement`
--
ALTER TABLE `traitement`
  ADD CONSTRAINT `FK_TRAITEMENT_malade_id_malade` FOREIGN KEY (`malade_id_malade`) REFERENCES `malade` (`id_malade`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
