# Understanding Merge Conflicts

## What caused the conflict?
I edited the same line in `testConflic.txt` on two branches:
- On `main`, I changed the line to: `Line A (Hello from main)`.
- On `testConflic`, I changed it to: `Line A (Hello from testConflic)`.

Because both branches modified the **same line**, Git could not auto-merge and produced conflict markers.

## How did I resolve it?
I opened `testConflic.txt`, reviewed both versions, and selected the final content I wanted. Commited and Pushed with git extension on VSCode

## What did I learn?

- Conflicts are normal when two branches change the same lines.
- The key steps: 
    - open the conflicted file
    - decide the desired final text 
    - remove markers
    - stage
    - commit
    - push
- Good practices help avoid conflicts or make them easier to resolve:
    - Pull main frequently and merge/rebase often.
    - Keep PRs small and focused.
    - Communicate when you’re editing shared files/areas
