-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 17. 14:18
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
(2, 'Christiano Ronaldo', 85);

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
-- Tábla szerkezet ehhez a táblához `temakor`
--

CREATE TABLE `temakor` (
  `temakor_id` int(11) NOT NULL,
  `temakor_nev` varchar(255) NOT NULL,
  `temakor_fotema` int(11) NOT NULL,
  `temakor_kerdes` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `temakor`
--

INSERT INTO `temakor` (`temakor_id`, `temakor_nev`, `temakor_fotema`, `temakor_kerdes`) VALUES
(1, 'FC 26 játékosok érteklése', 2, 'Melyik játékosnak van nagyobb értékelése?'),
(2, 'Ország népesség', 1, 'Melyik országnak a népessége nagyobb?');

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
  MODIFY `foci_jatekos_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- AUTO_INCREMENT a táblához `temakor`
--
ALTER TABLE `temakor`
  MODIFY `temakor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
