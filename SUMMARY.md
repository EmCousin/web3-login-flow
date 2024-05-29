# SUMMARY

## Task

### Part 1

> Make a simple Ruby on Rails app that allows users to authenticate and create a server session, using MetaMask to authenticate users with the Rails backend.

On the backend, I set up a new Ruby on Rails application with Bun for JavaScript processing, allowing us to reuse the existing JS login demo and benefit from an extremely fast build process.

We're adopting an HTML-centric approach by converting the JavaScript plugin into a Stimulus controller that receives its state directly from the HTML. UI updates are managed through data attribute changes, using TailwindCSS to create arbitrary values-based classes that dynamically show or hide HTML elements as needed. This method makes JavaScript less obtrusive and maintains a clean and efficient codebase.

### Part 2: Improve

I noticed some friction in the authentication process: first, you have to connect to your wallet, and then you have to sign in to your Presail account. This process is impractical at best and confusing at worst. To streamline it, I modified the solution so that signing in and signing out are now combined actions, connecting or disconnecting both your wallet and your Presail account simultaneously.
