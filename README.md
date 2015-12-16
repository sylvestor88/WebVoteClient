# WebVoteClient

#### What?
The VoteApp allows user to Post Polls that they would like people to vote for either as Yes/No (the app will later allow users to provide multiple options to choose). The link to these Polls can then be shared with people from where they can register their votes for an active Poll. The Moderators can then check the result of these Polls once they log in. 

#### How?
To Post polls, user need to sign up to become a Moderator. The moderator can then create any number of polls he/she wishes to post and share the link with other people. Voters do not require to sign up to vote for a poll. The application does not restrict people to cast multiple votes.

The client accesses the services that are currenty running on EC2 instance. The source code of the REST services is in the repository:
```sh
    https://github.com/sylvestor88/WebVoteServer.git
```

The client application should also be running live on cloud 9 instance and can be accessed using the below link:
```sh
    http://angularclient-sylvestor88.c9users.io/index.html
```
