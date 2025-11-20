-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 20. 09:31
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
-- Tábla szerkezet ehhez a táblához `foci_jatekos`
--

CREATE TABLE `foci_jatekos` (
  `foci_jatekos_id` int(11) NOT NULL,
  `foci_jatekos_nev` varchar(255) NOT NULL,
  `foci_jatekos_ertekeles` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `foci_jatekos`
--

INSERT INTO `foci_jatekos` (`foci_jatekos_id`, `foci_jatekos_nev`, `foci_jatekos_ertekeles`) VALUES
(1, 'Dominik Szoboszlai', 83),
(2, 'Christiano Ronaldo', 85),
(3, 'Jude Bellingham', 180),
(4, 'Kylian Mbappé', 180),
(5, 'Erling Haaland', 175),
(6, 'Vinicius Junior', 150),
(7, 'Florian Wirtz', 130),
(8, 'Phil Foden', 130),
(9, 'Bukayo Saka', 125),
(10, 'Rodrygo', 110),
(11, 'Jamal Musiala', 110),
(12, 'Lamine Yamal', 100),
(13, 'Xavi Simons', 100),
(14, 'Victor Osimhen', 95),
(15, 'Lautaro Martínez', 95),
(16, 'Cole Palmer', 90),
(17, 'Declan Rice', 90),
(18, 'Rafael Leão', 90),
(19, 'Federico Valverde', 90),
(20, 'Gavi', 90),
(22, 'Alphonso Davies', 75);

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
(22, 'Románia', 19056172, 238397, 350414);

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
-- AUTO_INCREMENT a táblához `foci_jatekos`
--
ALTER TABLE `foci_jatekos`
  MODIFY `foci_jatekos_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
  MODIFY `orszag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `temakor`
--
ALTER TABLE `temakor`
  MODIFY `temakor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
