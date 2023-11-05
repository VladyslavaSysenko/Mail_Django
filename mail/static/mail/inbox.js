document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
  // Send email
  document.querySelector('#compose-view').addEventListener('submit', send_email);
});


// Compose email
function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


// Send email
function send_email(event) {
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // if email is sent
      if (result.message){
        load_mailbox('sent');
      }
      // if no recipient or repicient's email doesn't exist
      else if (result.error){
        alert(result.error);
      }
  });
}


// Load email
function load_email(email_id, mailbox) {
   // Show the empty email and hide other views
   document.querySelector('#email-view').style.display = 'block';
   document.querySelector('#email-view').innerHTML = '';
   document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#compose-view').style.display = 'none';
   // Email content
   fetch('/emails/' + email_id)
   .then(response => response.json())
   .then(email => {
      // Show email
      document.querySelector('#email-view').innerHTML = `
        <div class="form-group form-control">From : ${email.sender}</div>
        <div class="form-group form-control">To : ${email.recipients}</div>
        <div class="form-group form-control">Subject : ${email.subject}</div>
        <div class="form-group" style="white-space: pre;"><textarea class="form-control" readonly>${email.body}</textarea></div>
        <div class="form-group form-control"> ${email.timestamp}</div>
        <div class='center'>
        <button class="btn btn-info" onclick='reply(${email.id});'> Reply </button>
        <button class="btn btn-info" onclick='archive(${email.id}, ${email.archived});'> ${email.archived ? 'Unarchive' : "Archive"} </button> 
        </div>`
      // Mark email as read
      fetch('/emails/' + email_id, {
        method: 'PUT',
        body: JSON.stringify({read: true})
      })
   })
}

// Archive email
function archive(email_id, arch){
  fetch('/emails/' + email_id, {
    method: 'PUT',
    body: JSON.stringify({archived: (arch ? false : true)})
  })
  .then(response=>{
    console.log(response);
    load_mailbox('inbox');
  })
}


// Reply to email
function reply(email_id){
  // Get information to prefill
  fetch('/emails/' + email_id)
   .then(response => response.json())
   .then(email => {
      // Show compose view and hide other views
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#email-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';
      // Clear out composition fields
      document.querySelector('#compose-recipients').value = email.sender;
      if (email.subject.slice(0,3)=== "Re:") {
        document.querySelector('#compose-subject').value = `${email.subject}`;
      }
      else 
      {document.querySelector('#compose-subject').value = `Re: ${email.subject}`;}
      document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: \n\t${email.body}\n \n`;
    })
}


// Load mailbox
function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h2>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h2>`;
  // Show emails
  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
  // Print emails
  emails.forEach(email => {
      // make email div
      elem = document.createElement('div');
      elem.className = "email";
      // add content
      elem.innerHTML = `
        <div><span class="aux_words">From:</span> &emsp;&emsp;${email.sender}</div>
        <div><span class="aux_words">Subject:</span> &emsp;${email.subject}</div>
        <div> <span class="aux_words">${email.timestamp}</span></div>`;
      // change background color
      if (email.read === true){
        elem.style.backgroundColor = "rgba(125, 215, 251, 0.63)";
    }  
      else {
        elem.style.backgroundColor = "rgba(248, 146, 191, 0.87)"
    }
      // Show email when clicked
      elem.addEventListener('click', function() {
        load_email(email.id, mailbox);
      });
      document.querySelector('#emails-view').append(elem);
  });
});
}