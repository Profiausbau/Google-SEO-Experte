<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Eingaben bereinigen
    $name = htmlspecialchars(trim($_POST["name"]));
    $email = htmlspecialchars(trim($_POST["email"]));
    $nachricht = htmlspecialchars(trim($_POST["nachricht"]));

    // Zieladresse
    $empfaenger = "info@media-aachen.de";
    $betreff = "Neue Kontaktanfrage von $name";
    $inhalt = "Name: $name\nE-Mail: $email\n\nNachricht:\n$nachricht";

    $header = "From: $email\r\n";
    $header .= "Reply-To: $email\r\n";
    $header .= "Content-Type: text/plain; charset=utf-8\r\n";

    // E-Mail senden
    if (mail($empfaenger, $betreff, $inhalt, $header)) {
        // Erfolg → Weiterleitung auf Dankeseite
        header("Location: danke.html");
        exit;
    } else {
        echo "Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.";
    }
} else {
    echo "Ungültige Anfrage.";
}
?>
