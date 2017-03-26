Goal: determine quantities of breakfast ingredients to meet dietary requirements

Constraints:
  - For simplicity, let's assume everything can be divided by gram (as opposed to, e.g., eggs)
  - Let's only consider breakfasts composed of combined raw ingredients where all ingredients can be of arbitrary quantities (i.e. not proportional to one another)
  - Output ingredients must meet dietary requirements, or within threshold

Input:
  - available ingredients
    - type
    - maximum quantity
  - nutritional content goals
  - acceptable margin of error (e.g. 2% above or below dietary goal is acceptable)

Output:
  - ingredients
    - type
    - desired quantity
    - nutritional content
  - total nutritional content

Notes:
  - This is a constraint satisfaction problem, possibly more suited to a language like Prolog.
  - Options detailed below, but in both cases I have to get the data from somewhere and then hook it all up. Probably it'd be better to use an existing solution.


Implementation options:

  1. Constraint satisfaction by hand
    - If no unused ingredients remain
      - fail
    - Choose one ingredient from the list of remaining ingredients:
      A) Construct a choicepoint including:
        - The included ingredients so far
        - Remaining ingredients
        - Previously attempted choices ([ingredient])
      - Include the maximum of that ingredient without exceeding dietary requirements
      - If the dietary requirements are satisfied, return
      - Else if some ingredients remain, recurse
      - Else, backtrack:
        - Take the most recent choicepoint
          - If it has possible choices remaining, repeat from A) with a different choice
          - Else, pop it from the stack and try the next choicepoint
  2. Use a prebuilt constraint-satisfaction library
    - Figure out how to use it
    - Get nutrition data
    - Hook it all up

Choicepoint stack: []
Current state: ingredients used, goals

- ([], [A, B, C])
  - Choose A
  - ([A], [B, C])
    - Choose B
    - ([A,B], [C])
      - Backtrack!
    - ([A], [B, C])
      - Choose C
      - ([A, C], [B])
        - Choose B
        - ([A, C, B], [])
          - Satisfied? Success.
          - Unsatisfied? Backtrack.
