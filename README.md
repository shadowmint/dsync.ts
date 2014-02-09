# dSync

This is a state synchronization library.

## Usage

    <script src="../bin/dsync.js"></script>
    <div id="content1"></div>

    <script>
      var sync = new dsync.Sync();
      var model = { content: 'Hello world' };
      var display = { out: document.getElementById('content1') };

      // Setup events channel
      sync.channel('hello')

      // State helpers
      var stateModel = function(m) { return [m.content] };
      var applyModel = function(m, d) { d.out.innerHTML = m.content; return true; };

      // When model changes, apply to display
      sync.channel(sync.channels.hello).add(applyModel, stateModel, model, display);

      // Sync!
      sync.update();
    </script>

## About

Working directly with dsync can be awkward sometimes, but it provies the basic low
level operations required to create an Angular.js style live data binding library.

## Using grunt

Install npm dependencies:

    npm install

Then us grunt to build and test:

    grunt - Builds distribution targets

    grunt test - Runs tests

    grunt dev - Interactive dev mode with tests

### Quickstart

    npm run dev
