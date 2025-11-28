-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 28. 12:33
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `higherorlower`
--
CREATE DATABASE IF NOT EXISTS `higherorlower` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `higherorlower`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `account`
--

CREATE TABLE `account` (
  `felh_id` int(11) NOT NULL,
  `felh_nev` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `felh_jelszo` varchar(255) NOT NULL,
  `felh_szerepkor` varchar(50) NOT NULL DEFAULT 'user',
  `regisztracio_datuma` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `account`
--

INSERT INTO `account` (`felh_id`, `felh_nev`, `email`, `felh_jelszo`, `felh_szerepkor`, `regisztracio_datuma`) VALUES
(8, 'Matteo0311', 'levaimate03@gmail.com', '$2b$10$0uoZTz8/c8GHZCfyXpiv3u5JR/RWCUq6xl/DfyoiDc/Lwo0.C9aDW', 'user', '2025-11-28 08:32:30');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foci_jatekos`
--

CREATE TABLE `foci_jatekos` (
  `foci_jatekos_id` int(11) NOT NULL,
  `foci_jatekos_nev` varchar(255) NOT NULL,
  `foci_jatekos_ertekeles` int(11) NOT NULL,
  `foci_jatekos_piaci_ertek` int(11) NOT NULL,
  `foci_jatekos_eletkor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `foci_jatekos`
--

INSERT INTO `foci_jatekos` (`foci_jatekos_id`, `foci_jatekos_nev`, `foci_jatekos_ertekeles`, `foci_jatekos_piaci_ertek`, `foci_jatekos_eletkor`) VALUES
(1, 'Mohamed Salah', 91, 65000000, 33),
(2, 'Kylian Mbappe', 91, 180000000, 26),
(3, 'Ousmane Dembele', 90, 60000000, 28),
(4, 'Rodri', 90, 120000000, 29),
(5, 'Virgil van Dijk', 90, 35000000, 34),
(6, 'Jude Bellingham', 90, 180000000, 22),
(7, 'Erling Haaland', 90, 180000000, 25),
(8, 'Raphinha', 89, 50000000, 29),
(9, 'Achraf Hakimi', 89, 80000000, 26),
(10, 'Lamine Yamal', 89, 90000000, 18),
(11, 'Vitinha', 89, 50000000, 25),
(12, 'Gianluigi Donnarumma', 89, 45000000, 26),
(13, 'Pedri', 89, 80000000, 23),
(14, 'Joshua Kimmich', 89, 60000000, 30),
(15, 'Alisson', 89, 20000000, 32),
(16, 'Harry Kane', 89, 90000000, 32),
(17, 'Federico Valverde', 89, 100000000, 27),
(18, 'Vini Jr.', 89, 180000000, 25),
(19, 'Florian Wirtz', 89, 130000000, 22),
(20, 'Thibaut Courtois', 89, 20000000, 33),
(21, 'Robert Lewandowski', 88, 15000000, 37),
(22, 'Lautaro Martinez', 88, 100000000, 28),
(23, 'Alexander Isak', 88, 140000000, 26),
(24, 'Jamal Musiala', 88, 120000000, 22),
(25, 'Gabriel', 88, 70000000, 28),
(26, 'Bukayo Saka', 88, 150000000, 24),
(27, 'Jan Oblak', 88, 25000000, 32),
(28, 'Cole Palmer', 87, 120000000, 23),
(29, 'Khvicha Kvaratskhelia', 87, 100000000, 24),
(30, 'Alessandro Bastoni', 87, 80000000, 26),
(31, 'Serhou Guirassy', 87, 40000000, 29),
(32, 'Kevin De Bruyne', 87, 25000000, 34),
(33, 'Frenkie de Jong', 87, 70000000, 28),
(34, 'Declan Rice', 87, 120000000, 26),
(35, 'Marquinhos', 87, 60000000, 31),
(36, 'Yann Sommer', 87, 4000000, 36),
(37, 'Jules Kounde', 87, 60000000, 27),
(38, 'Bruno Fernandes', 87, 70000000, 31),
(39, 'William Saliba', 87, 90000000, 24),
(40, 'Julian Alvarez', 87, 90000000, 25),
(41, 'Jonathan Tah', 87, 35000000, 29),
(42, 'Alexis Mac Allister', 87, 70000000, 26),
(43, 'Mike Maignan', 87, 40000000, 30),
(44, 'Martin Odegaard', 87, 90000000, 26),
(45, 'David Raya', 87, 40000000, 30),
(46, 'Viktor Gyokeres', 87, 65000000, 27),
(47, 'Nicolo Barella', 87, 75000000, 28),
(48, 'Victor Osimhen', 87, 100000000, 26),
(49, 'Nuno Mendes', 86, 65000000, 23),
(50, 'Antonio Rudiger', 86, 14500000, 32),
(51, 'T. Alexander-Arnold', 86, 75000000, 27),
(52, 'Ruben Dias', 86, 75000000, 28),
(53, 'Paulo Dybala', 86, 25000000, 32),
(54, 'Bruno Guimaraes', 86, 85000000, 28),
(55, 'Willian Pacho', 86, 35000000, 24),
(56, 'Ibrahima Konate', 86, 45000000, 26),
(57, 'H. Çalhanoğlu', 86, 45000000, 31),
(58, 'Lionel Messi', 86, 30000000, 38),
(59, 'Sandro Tonali', 86, 45000000, 25),
(60, 'Nico Williams', 86, 60000000, 23),
(61, 'M. ter Stegen', 86, 20000000, 33),
(62, 'Gregor Kobel', 86, 40000000, 28),
(63, 'Ederson', 85, 35000000, 32),
(64, 'F. Dimarco', 85, 40000000, 28),
(65, 'Scott McTominay', 85, 30000000, 28),
(66, 'R. Gravenberch', 85, 35000000, 23),
(67, 'E. Martínez', 85, 28000000, 33),
(68, 'Joao Neves', 85, 55000000, 21),
(69, 'A. Griezmann', 85, 12000000, 34),
(70, 'N. Kanté', 85, 15000000, 34),
(71, 'Desire Doue', 85, 35000000, 20),
(72, 'Carvajal', 85, 8000000, 33),
(73, 'Unai Simon', 85, 40000000, 28),
(74, 'Marcus Thuram', 85, 45000000, 28),
(75, 'Luis Diaz', 85, 75000000, 28),
(76, 'De Gea', 85, 5000000, 35),
(77, 'N. Schlotterbeck', 85, 35000000, 26),
(78, 'Heung Min Son', 85, 45000000, 33),
(79, 'Phil Foden', 85, 120000000, 25),
(80, 'Youri Tielemans', 85, 35000000, 28),
(81, 'Granit Xhaka', 85, 28000000, 33),
(82, 'Karim Benzema', 85, 10000000, 37),
(83, 'Inigo Martinez', 85, 5000000, 34),
(84, 'Cristiano Ronaldo', 85, 12000000, 40),
(85, 'Rodrygo', 85, 100000000, 24),
(86, 'Dani Olmo', 85, 50000000, 27),
(87, 'Bremer', 85, 50000000, 28),
(88, 'Theo Hernandez', 84, 60000000, 28),
(89, 'Marcos Llorente', 84, 35000000, 30),
(90, 'Rodrigo De Paul', 84, 35000000, 31),
(91, 'Joao Cancelo', 84, 30000000, 31),
(92, 'Jordan Pickford', 84, 28000000, 31),
(93, 'S. Milinković-Savić', 84, 30000000, 30),
(94, 'Josko Gvardiol', 84, 75000000, 23),
(95, 'A. Tchouaméni', 84, 75000000, 25),
(96, 'Grimaldo', 84, 45000000, 30),
(97, 'Benjamin Pavard', 84, 20000000, 29),
(98, 'Wojciech Szczesny', 84, 5000000, 35),
(99, 'Mattia Zaccagni', 84, 25000000, 30),
(100, 'G. Mamardashvili', 84, 40000000, 25),
(101, 'Willi Orbán', 84, 8000000, 33),
(102, 'Dominik Szoboszlai', 83, 75000000, 25);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fotema`
--

CREATE TABLE `fotema` (
  `fotema_id` int(11) NOT NULL,
  `fotema_nev` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `fotema`
--

INSERT INTO `fotema` (`fotema_id`, `fotema_nev`) VALUES
(1, 'Ország'),
(2, 'Sport');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kerdes`
--

CREATE TABLE `kerdes` (
  `kerdes_id` int(11) NOT NULL,
  `kerdes_nev1` varchar(255) NOT NULL,
  `kerdes_ertek1` int(11) NOT NULL,
  `kerdes_kep1` varchar(255) NOT NULL,
  `kerdes_nev2` varchar(255) NOT NULL,
  `kerdes_ertek2` int(11) NOT NULL,
  `kerdes_kep2` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `orszag`
--

CREATE TABLE `orszag` (
  `orszag_id` int(11) NOT NULL,
  `orszag_nev` varchar(255) NOT NULL,
  `orszag_nepesseg` int(11) NOT NULL,
  `orszag_nagysag` int(11) NOT NULL,
  `orszag_gdp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `orszag`
--

INSERT INTO `orszag` (`orszag_id`, `orszag_nev`, `orszag_nepesseg`, `orszag_nagysag`, `orszag_gdp`) VALUES
(1, 'Magyarország', 9599744, 93030, 203800),
(2, 'Egyesült Államok', 339996563, 9833520, 26949643),
(3, 'Kína', 1425671352, 9596961, 17700899),
(4, 'Németország', 83294633, 357022, 4429838),
(5, 'Japán', 123294513, 377975, 4230862),
(6, 'India', 1428627663, 3287263, 3732224),
(7, 'Egyesült Királyság', 67736802, 242495, 3332059),
(8, 'Franciaország', 64756584, 551695, 3049016),
(9, 'Olaszország', 58870762, 301340, 2186082),
(10, 'Brazília', 216422446, 8515767, 2126809),
(11, 'Kanada', 38781291, 9984670, 2117805),
(12, 'Oroszország', 144444359, 17098242, 1862470),
(13, 'Mexikó', 128455567, 1964375, 1811468),
(14, 'Dél-Korea', 51784059, 100210, 1709232),
(15, 'Ausztrália', 26439111, 7692024, 1687713),
(16, 'Spanyolország', 47519628, 505990, 1582054),
(17, 'Indonézia', 277534122, 1904569, 1417387),
(18, 'Törökország', 85816199, 783562, 1154600),
(19, 'Hollandia', 17618299, 41543, 1092748),
(20, 'Szaúd-Arábia', 36947025, 2149690, 1069437),
(21, 'Lengyelország', 36753736, 312696, 842172),
(22, 'Románia', 19056172, 238397, 350414),
(23, 'Liechtenstein', 40000, 160, 7500),
(24, 'Észak-Korea', 26100000, 120540, 18000);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `temakor`
--

CREATE TABLE `temakor` (
  `temakor_id` int(11) NOT NULL,
  `temakor_nev` varchar(255) NOT NULL,
  `temakor_fotema` int(11) NOT NULL,
  `temakor_kerdes` varchar(255) NOT NULL,
  `tabla_nev` varchar(50) DEFAULT NULL,
  `oszlop_nev` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `temakor`
--

INSERT INTO `temakor` (`temakor_id`, `temakor_nev`, `temakor_fotema`, `temakor_kerdes`, `tabla_nev`, `oszlop_nev`) VALUES
(1, 'FC 26 játékosok érteklése', 2, 'Melyik játékosnak van nagyobb értékelése?', 'foci_jatekos', 'foci_jatekos_ertekeles'),
(2, 'Ország népesség', 1, 'Melyik országnak a népessége nagyobb?', 'orszag', 'orszag_nepesseg'),
(3, 'Ország terület', 1, 'Melyik ország területe nagyobb?', 'orszag', 'orszag_nagysag'),
(4, 'Ország GDP', 1, 'Melyik országnak magasabb a GDP-je?', 'orszag', 'orszag_gdp');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`felh_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `foci_jatekos`
--
ALTER TABLE `foci_jatekos`
  ADD PRIMARY KEY (`foci_jatekos_id`);

--
-- A tábla indexei `fotema`
--
ALTER TABLE `fotema`
  ADD PRIMARY KEY (`fotema_id`);

--
-- A tábla indexei `kerdes`
--
ALTER TABLE `kerdes`
  ADD PRIMARY KEY (`kerdes_id`);

--
-- A tábla indexei `orszag`
--
ALTER TABLE `orszag`
  ADD PRIMARY KEY (`orszag_id`);

--
-- A tábla indexei `temakor`
--
ALTER TABLE `temakor`
  ADD PRIMARY KEY (`temakor_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `account`
--
ALTER TABLE `account`
  MODIFY `felh_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `foci_jatekos`
--
ALTER TABLE `foci_jatekos`
  MODIFY `foci_jatekos_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT a táblához `fotema`
--
ALTER TABLE `fotema`
  MODIFY `fotema_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `kerdes`
--
ALTER TABLE `kerdes`
  MODIFY `kerdes_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `orszag`
--
ALTER TABLE `orszag`
  MODIFY `orszag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT a táblához `temakor`
--
ALTER TABLE `temakor`
  MODIFY `temakor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
