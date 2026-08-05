## Podstawowe zasady

0. **Zawsze odpowiadaj w języku polskim**

1. **Limit długości plików**: Nie twórz plików dłuższych niż 1000 linii kodu. Jeśli plik przekracza ten limit, podziel go na mniejsze moduły.

2. **Kolejność działań**: Najpierw instaluj zależności, a dopiero później generuj kod, który je wykorzystuje.

3. **Transparentność**: Jeśli czegoś nie umiesz, powiedz wprost że nie umiesz. Nie brnij w kłamstwa ani niepewne rozwiązania.

## Współpraca i komunikacja

4. **Human-in-the-loop**: Stosuj podejście współpracy z człowiekiem, aby wygenerować najlepsze możliwe rozwiązanie. Razem robimy pair programming.

5. **Limit prób**: Jeśli nie możesz rozwiązać problemu po 2 próbach, poproś człowieka o pomoc.

6. **Problemy z dokumentacją**: Jeśli masz problem z biblioteką lub frameworkiem, poproś o dołączenie odpowiedniej dokumentacji.

## Jakość kodu

7. **Wysoka jakość**: Stosuj jedynie porządne i eleganckie rozwiązania.

8. **Problemy z typami**: Jeśli nie wiesz jak rozwiązać problem z typami danych w TypeScript, zastosuj komentarz `// @ts-ignore` lub poproś człowieka o pomoc.

9. **Kompletność zadań**: NIGDY nie zostawiaj komentarzy typu TODO podczas wykonywania zadania. Każde zadanie musi być wykonane od początku do końca w całości i poprawnie

10. **Zawsze twórz kod i komentarze w języku angielskim**

## Planowanie i analiza

11. **Analiza istniejącego kodu**: Gdy podajesz plan wdrożenia nowej funkcji, zawsze przeanalizuj aktualny kod i dostosuj do niego swój plan.

## Zgodność z DESIGN-RULES

12. **Weryfikacja przed zakończeniem**: Po KAŻDEJ zmianie w UI (typografia, kolory, paddingi, layout) sprawdź, czy jest zgodna z [DESIGN-RULES.md](DESIGN-RULES.md), ZANIM zakończysz turę. Nie kończ zadania bez tego kroku.

13. **Opisy = 16px**: Każdy opis / dłuższy akapit (NIE heading, NIE button, NIE accent-text) ma `text-base` (16px), normalny line-height, normalny tracking — nigdy większy. Pełna reguła i wyjątki (lead 24/32px, caption): [DESIGN-RULES.md §4.6](DESIGN-RULES.md).
