/**
 * This file handles the logic behind the counter. This logic was separated so
 * we could have a fairly robust counter without cluttering up the main page.
 * This allows the student to concentrate on sending simple commands to the
 * counter instead of dealing with the complex logic behind it.
 *
 * The counter is based on an interval timer so the user could see the counter
 * incrementing. without the interval, the counter was nearly intantanious. The
 * interval also allows for user interaction while the counter is counting.
 */

/** Constant defining the counter interval time in milliseconds */
var COUNTER_INTERVAL_TIME = 250;

/** The current value of the counter */
var _counterValue = 0;

/** The number of times the counter should count */
var _iterationCount = 0;

/** The handle of the interval used to update the counter */
var _counterIntervalHandle = null;

/** Callback function that is called when counting is completed (not paused).
 * Can be set when runCounter is called. */
var _doneCallback = null;

/**
 * Function called to increment the number of iterations we want the counter
 * to run.
 */
function incrementCounter() {
    _iterationCount += 1;
}

/**
 * Function to kick off an interval used to update the counter at a
 * human-readable speed.
 */
function runCounter(doneCallback) {
    if (doneCallback) {
        _doneCallback = doneCallback;
    }

    if (_iterationCount > 0) {
        _startCounter();
    }
}

/**
 * Function that stops or restarts the counter. The no values are reset and the
 * done callback is not called.
 */
function pauseCounter() {
    if (_counterIntervalHandle !== null) {
        _stopCounter();
    }
    else if (_iterationCount > 0) {
        _startCounter();
    }
}

/**
 * Function to reset the counter. If the counter is running, it is stopped and
 * the done callback is called. The values are reset to 0 and the HTML is
 * updated.
 */
function resetCounter() {
    _stopCounter()

    // Reset the values and update the HTML
    _counterValue = 0;
    _iterationCount = 0;
    _render();

    // Call the done callback
    _done();
}

/**
 * Function called by setInterval to increment the counter and update the HTML.
 * Also checks if all of the iterations are completed. If so, the interval is
 * cleared.
 */
function _updateCounter() {
    // Increment the counter value and decrement the iteration count
    _iterationCount -= 1;
    _counterValue += 1;
    console.log("iterationCount: " + _iterationCount + " counterValue: " + _counterValue);

    // update the view
    _render();

    // Check if we are done.
    if (_iterationCount <= 0) {
        _stopCounter();
        _done();
    }
}

/**
 * Function that stops the counter by clearing the interval
 */
function _stopCounter() {
    // Stop the interval from running
    clearInterval(_counterIntervalHandle);
    _counterIntervalHandle = null;
}

/**
 * Function to start the counter by creating an interval. If an interval is
 * already running, we leave it be.
 */
function _startCounter() {
    // Create the interval used to continue the counter
    if (_counterIntervalHandle === null) {
        // Only create the interval if there isn't one already running
        _counterIntervalHandle = setInterval(_updateCounter, COUNTER_INTERVAL_TIME);
    }
}

/**
 * Function called when the counting is done or reset. Checks for callback and
 * if there is one, call it then clear it.
 */
function _done() {
    if (_doneCallback) {
        _doneCallback();
        _doneCallback = null;
    }
}

/**
 * Function to update the HTML with the current values
 */
function _render() {
    var resultElement = document.getElementById('result');
    resultElement.innerHTML = _counterValue;
}