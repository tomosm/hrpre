var FriendlyDate = function (date) {
  this.date = date || new Date();
};

FriendlyDate.prototype.fromNow = function () {
  var currentDate = new Date(Date.now());
  var targetDate = new Date(Date.parse(this.date));

  if ((currentDate.getFullYear() - targetDate.getFullYear()) > 1 ||
    ((currentDate.getFullYear() - targetDate.getFullYear()) > 0 && (currentDate.getMonth() - targetDate.getMonth()) > 0)) {
    var gapYear = currentDate.getFullYear() - targetDate.getFullYear();
    if (currentDate.getMonth() - targetDate.getMonth() > 0) {
      gapYear += 1;
    }
    return gapYear + 'years ago';
  } else if ((currentDate.getMonth() - targetDate.getMonth()) > 0) {
    var gapMonth = currentDate.getMonth() - targetDate.getMonth();
    if (currentDate.getDate() - targetDate.getDate() > 0) {
      gapMonth += 1;
    }
    return gapMonth + 'months ago';
  }

  var pastSeconds = Math.ceil((currentDate - targetDate) / 1000);
  if (pastSeconds <= 1) {
    return 'Just now';
  } else if (pastSeconds < 60) {
    return pastSeconds + ' seconds ago';
  } else if (pastSeconds < 3600) {
    return Math.floor(pastSeconds / 60) + ' minutes ago';
  } else if (pastSeconds < 86400) {
    return Math.floor(pastSeconds / 3600) + ' hours ago';
  } else if (pastSeconds < 604800) {
    return Math.floor(pastSeconds / 86400) + ' days ago';
  } else {
    return Math.floor(pastSeconds / 86400) + ' week ago';
  }
};

$.fn.filterNoData = function (key, value) {
  return this.filter(function () {
    return $(this).data(key) !== value;
  });
};

$.fn.none = function () {
  return this.css('display') === 'none';
};


// =================================================
$(document).ready(function () {
  visitor = null;

  $('body > header').on('mouseup touchend', '.logo', function () {
    setGlobalUser(null);
    loadTweets(streams.home, true);
  });

  var $main = $('main');
  $main.on('mouseup touchend', '.tweet-button', function () {
    var tweet = $(this).closest('.home-user-tweet').find('.editor').val();
    if (!!tweet) {
      writeTweet(tweet);
      loadTweets(streams.users[visitor], false);
    }
  });

  $main.on('change keyup', '.editor', function () {
    $(this).closest('.home-user-tweet').find('.tweet-button').prop('disabled', !$(this).val());
  });

  $main.on('mouseup touchend', 'a', function (event) {
    event.preventDefault();
    event.stopPropagation();
    setGlobalUser($(this).data('name'));
    loadTweets(streams.users[visitor], true);
  });

  $main.on('mouseup touchend', '#load-new-tweets', function () {
    loadTweets(!!visitor ? streams.users[visitor] : streams.home, false);
  });

  var setGlobalUser = function (user) {
    visitor = user;
    if (!!visitor) {
      $main.find('.home-user-tweet').show().find('.username').text(user);
    } else {
      $main.find('.home-user-tweet').hide().find('.username').empty();
    }
  };

  var loadTweets = function (streams, reload) {
    $('#load-new-tweets').remove();
    if (reload) {
      $main.find('.tweet').remove();
      this.from = 0;
    }
    if (!this.from) {
      this.from = 0;
    }

    for (var i = this.from, l = streams.length; i < l; i++) {
      var tweet = streams[i];
      var $tweetHeader = $('<header></header>');
      var $userlink = $('<a></a>').attr('href', '#').text(tweet.user).data('name', tweet.user);
      var $username = $('<span></span>').text('@' + tweet.user).data('name', tweet.user);
      var $created = $('<span class="friendlydate"></span>').text(new FriendlyDate(tweet.created_at).fromNow());
      $tweetHeader.append($userlink).append($username).append($created);

      var $tweet = $('<article class="box tweet"></article>');
      var $message = $('<p></p>').text(tweet.message);
      $tweet.append($tweetHeader).append($message);
      $tweet.appendTo($main);
    }
    this.from = l;
  };

  loadTweets(streams.home, true);

  var toggleLoadNewTweets = function () {
    var $loadNewTweets = $('#load-new-tweets');
    if ($loadNewTweets.length === 0) {
      $main.append($('<div id="load-new-tweets" class="main-box-width" style="display: none;"></div>').text('Load new tweets'));
    }
    var tweetLength = $main.find('.tweet').length;
    if ($main.find('.home-user-tweet').none()) {
      if (streams.home.length > tweetLength) {
        $loadNewTweets.show();
      }
    } else {
      if (streams.users[visitor].length > tweetLength) {
        $loadNewTweets.show();
      }
    }
  };

  setInterval(toggleLoadNewTweets, Math.random() * 3000);
});
