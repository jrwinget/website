+++
# Contact widget.
widget = "contact"
active = true
date = "2016-04-20T00:00:00"

title = "Contact"
subtitle = ""

# Order that this section will appear in.
weight = 11

# Automatically link email and phone?
autolink = true

+++

If you have any questions or would like to discuss something further, please complete the form below, and I will respond as soon as possible. Typical response time is approximately 1 business day.

<form action="https://formspree.io/jwinget@luc.edu" method="POST">
  <label for="name">Your name: </label>
  <input type="text" name="name" required="required" placeholder=""><br>
  <label for="email">Your email: </label>
  <input type="email" name="_replyto" required="required" placeholder=""><br>
  <label for="message">Message: </label><br>
  <textarea rows="4" name="message" id="message" required="required" class="form-control" placeholder=""></textarea>
  <input type="submit" value="Send" name="submit" class="btn btn-primary btn-outline">
  <input type="hidden" name="_subject" value="Message from jrwinget.com">
  <input type="text" name="_gotcha" style="display:none" />
</form>