<!DOCTYPE html>
<html>
  <head>
    <title>Join Hackerspace.gr</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css" href="static/lib/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="static/css/app.css">
    <link rel="stylesheet" type="text/css" href="static/css/membership.css">
    <link rel="shortcut icon" href="favicon.ico">
  </head>
  <body>

    <div class="container" style="margin-bottom:10px;">
      <div class="page-header">
        <p>
          <img alt="logo" src="static/img/hackerspace.svg">
        </p>
        <h3>Join Hackerspace.gr</h3>
      </div>

      <form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="post">
      <?php

          $valid = False;

          if ($_POST['name']) {
              // Sanitize
              $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
              $email = htmlspecialchars(stripslashes(trim($_POST['email'])));
              $memberspage = $_POST['memberspage'];
              $discusslist = $_POST['discusslist'];
              $addrrec = htmlspecialchars(stripslashes(trim($_POST['addrrec'])));
              $addrstreet = htmlspecialchars(stripslashes(trim($_POST['addrstreet'])));
              $addrpo = htmlspecialchars(stripslashes(trim($_POST['addrpo'])));
              $addrcity = htmlspecialchars(stripslashes(trim($_POST['addrcity'])));
              $addrcountry = htmlspecialchars(stripslashes(trim($_POST['addrcountry'])));
              $headers  = "MIME-Version: 1.0" . "\r\n";
              $headers .= "Content-type: text/plain; charset=UTF-8" . "\r\n";
              $headers .= "From: hsgrbot <noreply@hackerspace.gr>";

              if ( (strlen($name) != 0) && (strlen($email) != 0)) {
                  $text = "name: ".$name."\nemail: ".$email."\nmemberspage: ".$memberspage."\ndiscusslist: ".$discusslist."\n\n";
                  $text = $text."recipient: ".$addrrec."\nstreet: ".$addrstreet."\npo: ".$addrpo."\ncity: ".$addrcity."\ncountry: ".$addrcountry;
                  mail("registration@hackerspace.gr", "[hsgr] Membership request", "$text", $headers);
                  $valid = True;
                  echo "<div class='alert alert-success membership-notice'>Thank you! Just one more step...<br><br>Pay your first subscription on <a href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SU9M26K3ALNV8' target='_blank'>Paypal</a> or <a href='https://www.patreon.com/hackerspacegr' target='_blank'>Patreon</a>.</div>";
              } else {
                  $errormsg = '<p class="text-danger">You either missed a required field or captcha</p>';
              }
          }

          if ( !$valid ) {
      ?>
      <div class="membership-body">
        <div class="alert alert-info membership-notice">
          <p>
            Hackerspace.gr is open for everyone to utilize its space and tools.
            Just visit the space and join its vibrant community.
          </p>
          <p>
            Our awesome members are the people who make this happen with a small sustaining subscription.
          </p>
          <p>
            Do you want to be one of them? Fill this form.
          </p>
          <p>
            All members have the following rights/obligations:
            <ul>
              <li>Mention at the <a href="https://www.hackerspace.gr/#/people/" target="_blank">Members page</a> (optional).</li>
              <li>A <a href="http://hackadaycom.files.wordpress.com/2013/10/hackerspace-passport-custom.jpg?w=580&h=302" target="_blank">Hackerspace Passport</a> with our stamp (optional).</li>
              <li>Financial support of Hackerspace.gr with a 3-month subscription (60&euro;).</li>
              <li>Endless respect from everyone else :-)</li>
            </ul>
          </p>
	  <p>Or you can do an one time <a href="https://www.hackerspace.gr/#/support">donation</a></p>
        </div>
        <div><?php echo $errormsg; ?></div>
        <div class="form-group has-error">
          <label for="Name">Name</label>
          <input type="text" class="form-control" name="name" required>
        </div>
        <div class="form-group has-error">
          <label for="Email">Email</label>
          <input type="email" class="form-control" name="email" required>
        </div>
        <div class="checkbox">
          <label>
            <input type="checkbox" name="memberspage" value="1"> Add me to <a href="https://www.hackerspace.gr/#/people/" target="_blank">members page</a>.
          </label>
        </div>
        <div class="checkbox">
          <label>
            <input type="checkbox" name="discusslist" value="1"> Subscribe me to discussions mailing list.
          </label>
        </div>
        <hr>
        <div class="form-group">
          <label for="address">Shipping Address - <small>in case you want your hackerspace passport :)</small></label><br>
          <label for="Recipient">Recipient</label>
          <input type="text" class="form-control" name="addrrec" placeholder="Recipient">
          <label for="Street">Street</label>
          <input type="text" class="form-control" name="addrstreet" placeholder="Street">
          <label for="P.O.">P.O.</label>
          <input type="text" class="form-control" name="addrpo" placeholder="P.O.">
          <label for="City">City</label>
          <input type="text" class="form-control" name="addrcity" placeholder="City">
          <label for="Country">Country</label>
          <input type="text" class="form-control" name="addrcountry" placeholder="Country">
        </div>
        <button type="submit" class="btn btn-primary">Send</button>

        <?php
            }
        ?>
      </div>
    </div>
  </body>
</html>
