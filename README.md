# **Mail**

This is an single-page-app email app based on Django and JavaScript that allows users to send and receive emails, read and archive them.

---

## **Detailed description**

You can either read or watch a video https://youtu.be/AHNMoCt7SqM


> Send Mail: User can send an email to existing user.
>
>Mailbox: When a user visits their Inbox, Sent mailbox, or Archive, the appropriate mailbox loads.
Each email renders in its own box that displays who the email is from, what the subject line is, and the timestamp of the email.
If the email is unread, it appears with a white background. If the email has been read, it appears with a gray background.
>
>View Email: When a user clicks on an email, the user is taken to a view where they see the content of that email. User can reply to emails in inbox.
Once the email has been clicked on, it marked as read. When viewing an Inbox email, the user is presented with a button that lets them archive the email. When viewing an Archive email, the user is presented with a button that lets them unarchive the email. 
>

---
## **To start the app**

- Cd into the commerce directory. 
- Run ***pip install -r requirements.txt*** to install all requirements.
- Run ***python manage.py runserver*** to start up the Django web server, and visit the website in your browser.

You can register as usual user or log into superuser via  
email - *superuser@superuser.com*  
password - *superuser*  
and go to http://127.0.0.1:8000/admin/ to see django admin interface.

---
## **To change database**

- In your terminal, cd into the commerce directory. 
- Run ***python manage.py makemigrations auctions*** to make migrations for the auctions app.
- Run ***python manage.py migrate*** to apply migrations to your database.