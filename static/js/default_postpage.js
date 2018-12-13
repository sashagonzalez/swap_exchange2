// This is the js for the default/index.html view.
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.get_single_post = function() {
        $.getJSON(get_single_post_url,
            function(data) {
                console.log(data.post_list);
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.post_list = data.post_list;
                // Post-processing.
                self.process_posts();
            }
        );
        console.log("I fired the get");
    };

    self.process_posts = function() {
        console.log("in process_post");
        // This function is used to post-process posts, after the list has been modified
        // or after we have gotten new posts. 
        // We add the _idx attribute to the posts. 
        enumerate(self.vue.post_list);
        // We initialize the smile status to match the like. 
        self.vue.post_list.map(function (e) {
            // I need to use Vue.set here, because I am adding a new watched attribute
            // to an object.  See https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats
            // The code below is commented out, as we don't have smiles any more. 
            // Replace it with the appropriate code for thumbs. 
            // // Did I like it? 
            // // If I do e._smile = e.like, then Vue won't see the changes to e._smile . 
            // Vue.set(e, '_smile', e.like); 

        });
    };

    self.add_question = function(post_id){
        console.log("post id");
        console.log(post_id);
        // We disable the button, to prevent double submission.
        $.web2py.disableElement($("#add-question"));
        var sent_question = self.vue.form_title; // Makes a copy 
        $.post(add_question_url,
            // Data we are sending.
            {
                question_question: self.vue.form_question,
                question_post_id: post_id
            },
            // What do we do when the post succeeds?
            function (data) {
                // Re-enable the button.
                $.web2py.enableElement($("#add-question"));
                // Clears the form.
                self.vue.form_question = "";
                // Adds the post to the list of posts. 
                var new_question = {
                    id: data.question_id,
                    question_question: sent_question,
                    question_post_id: post_id
                };
                self.vue.question_list.unshift(new_question);
                // We re-enumerate the array.
                self.process_questions();
                //self.get_questions();
            });
    };

    self.process_questions = function() {
        console.log("in process_questions");
        enumerate(self.vue.question_list);
        self.vue.post_list.map(function (e) {
            //Vue sets go here
            Vue.set(e, '_show_add_reply', false);
            //Vue.set(e,'_question_list',[]);
        });
    };

    self.get_questions = function(id){
        $.getJSON(get_question_list_url,
            {
                post_id: id
            },
            function(data) {
                console.log(data.question_list);                
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.question_list = data.question_list;
                // Post-processing.
                self.process_questions();
            }
        );
        console.log("I fired the get");
    }

    

    
    self.add_answer = function(question_idx){
        //disable reply button
        $.web2py.disableElement($("#add-answer"));
        //get content of reply
        var sent_content = self.vue.form_content;
        console.log("add reply before post");
        $.post(add_answer_url,
            // Data we are sending.
            {
                answer_content: self.vue.form_content,
                question_id: post_idx
            },
            // What do we do when the post succeeds?
            function (data) {
                // Re-enable the button.
                $.web2py.enableElement($("#add-answer"));
                // Clears the form.
                self.vue.form_content = "";
                // Adds the answer to the question.
                console.log("add reply data");
                console.log(data) 
                var new_answer = {
                    question_post_id: data.question_id,
                    question_answer: answer_content,
                }
                console.log("new answer data");
                var p = self.vue.question_list[question_idx];
                p.question_list.push(new_answer);
                console.log("before process questions");
                self.process_questions();
                console.log("after process questions");
            });
    }; 
    self.add_offer = function(post_id){
        $.web2py.disableElement($("#add-offer"));
        var sent_offer = self.vue.form_offer;
        $.post(add_offer_url,
            // Data we are sending.
            {
                price: sent_offer,
                post_id: post_id
            },
            // What do we do when the post succeeds?
            function (data) {
                // Re-enable the button.
                $.web2py.enableElement($("#add-offer"));
                // Clears the form.
                self.vue.form_content = "";
            });
    }

    //retrieve your offers new code as of today
    self.get_offer_list = function(post_id){
        console.log("in get_offer_list");
        $.getJSON(get_offer_list_url,
            {
                post_id: post_id
            },
            function(data) {                
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.user_post_list[post_idx].offer_list=data.offers;
                console.log("offer list");
                console.log(self.vue.user_post_list[post_idx].offer_list);
            }
        );
    }

    //add delete 
    //db.query()

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            form_question: "",
            post_list: [],
            _add_post: false,
            question_list: [],
            show_questions: false,
            edit_post: false,
            edit_post_id: "None",
            form_content: "",
            show_submit_question: false,
            show_add_offer: false,
            form_offer: "",

        },
        methods: {
            add_question: self.add_question,
            get_questions: self.get_questions,
            add_offer: self.add_offer,
            
        }

    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    // Gets the posts.
    self.get_single_post();
    self.get_questions();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
