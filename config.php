<?php
declare(strict_types=1);
const SITE_NAME = 'Escuela Infantil A Gatas';
function e(string $value): string { return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
