/* 

    Chatbots like DigramFlowm, Lex and Watson are used to create chatbots.
    What attribute a class Chat would have?
    A class Chat would have the following attributes:
    name: The name of the chat.
    description: The description of the chat.
    

    - question 
    - answer
    - user
    - message
    - logic 
    - intent
    - context
    - entity
    - action
    - event
    - memory
    - dialog
    - flow
    - state
    - transition
    - session
    - history
    - token
    - channel
    - platform
    - interface
    - request
    - response
    - emotion
    - sentiment
    - tone
    - language
    - translation
    - localization
    - internationalization
    - globalization
    - security
    - privacy


    What is a intent? 
    An intent is a purpose or goal expressed in a user's input, such as answering a question or processing a payment.

    What is a context?
    A context is a set of conditions that must be met for a specific intent to be triggered.

    What is a entity?
    An entity is a data type that represents a specific type of object or concept.

    What is a action?
    An action is a task that a chatbot performs in response to a user's input.

    What is a event?
    An event is a signal that triggers a specific action or behavior in a chatbot.

    What is a memory?
    A memory is a data store that a chatbot uses to remember information about a user or conversation.

    What is a dialog?
    A dialog is a conversation between a chatbot and a user.

    What is a flow?
    A flow is a sequence of steps that a chatbot follows to complete a task.

    What is a state?
    A state is a condition or mode that a chatbot can be in.

    What is a transition?
    A transition is a change from one state to another in a chatbot.

    What is a session?
    A session is a period of time during which a chatbot interacts with a user.

    What is a history?
    A history is a record of past interactions between a chatbot and a user.

    What is a token?
    A token is a unique identifier that a chatbot uses to authenticate a user.

    What is a channel?
    A channel is a platform or interface through which a chatbot communicates with users.

    What is a platform?
    A platform is a system or framework that a chatbot runs on.

    What is a interface?
    An interface is a way for a chatbot to interact with users.

    What is a request?
    A request is a message from a user to a chatbot.


    What is a response?

    A response is a message from a chatbot to a user.

    What is a emotion?

    An emotion is a feeling or mood expressed in a chatbot's response.

    What is a sentiment?

    A sentiment is an opinion or attitude expressed in a chatbot's response.

    What is a tone?

    A tone is a style or manner of expression used by a chatbot.

    What is a language?

    A language is a set of rules and conventions used to communicate between a chatbot and a user.

    What is a translation?

    A translation is the process of converting text from one language to another.


    What is a localization?

    A localization is the process of adapting a chatbot to a specific language or region.

    What is a internationalization?

    A internationalization is the process of designing a chatbot to support multiple languages and regions.

    What is a globalization?

    A globalization is the process of making a chatbot available to users around the world.

    What is a security?

    A security is a set of measures to protect a chatbot from unauthorized access or attacks.

    What is a privacy?

    A privacy is a set of rules and policies that govern how a chatbot handles user data.

    What is a chatbot?

    A chatbot is a computer program that simulates a conversation with human users, especially over the internet.

    What is a chat?

    A chat is a conversation between two or more people, especially over the internet.

    What is a message?

    A message is a piece of information that is sent or received in a chat.

    What is a user?

    A user is a person who interacts with a chatbot or participates in a chat.

    What is a logic?

    A logic is a set of rules or principles that govern the behavior of a chatbot.

    end of questions. 

    sincerely,
    - the chatbot guy 

*/  

class Chat {
  constructor(name, description) {
    this.name = name;
    this.description = description; 
    this.messages = [];
    this.id = Math.random().toString(36).substr(2, 9);
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
    this.deleted = false;
    this.users = []; 
  }

    addMessage(message) {
        this.messages.push(message);
    }

    addUser(user) {
        this.users.push(user);
    }

    deleteUser(user) {
        this.users = this.users.filter(u => u.id !== user.id);
    }

    delete() {
        this.deleted = true;
        this.deletedAt = new Date();
    }

    updateName(name) {
        this.name = name;
        this.updatedAt = new Date();
    }

    updateDescription(description) {
        this.description = description;
        this.updatedAt = new Date();
    }

    updateMessage(messageId, message) {
        const index = this.messages.findIndex(m => m.id === messageId);
        this.messages[index] = message;
    }

    updateMessage(messageId, message) {
        const index = this.messages.findIndex(m => m.id === messageId);
        this.messages[index] = message;
    }

    getMessages() {
        return this.messages;
    }

    getUsers() {
        return this.users;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            messages: this.messages,
            users: this.users,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
            deleted: this.deleted
        };
    }
}

module.exports = Chat;








