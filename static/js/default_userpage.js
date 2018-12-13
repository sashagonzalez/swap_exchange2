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

    self.add_post = function () {
        // We disable the button, to prevent double submission.
        $.web2py.disableElement($("#add-post"));
        var sent_title = self.vue.form_title; // Makes a copy 
        var sent_description = self.vue.form_description; // 
        var sent_price = self.vue.form_price;
        var sent_city = self.vue.form_city;
        var sent_image = self.vue.form_image;
        var sent_category = self.vue.form_category;
        $.post(add_post_url,
            // Data we are sending.
            {
                post_category: self.vue.form_category,
                post_title: self.vue.form_title,
                post_description: self.vue.form_description,
                post_price: self.vue.form_price,
                post_city: self.vue.form_city,
                post_image: self.vue.form_image
            },
            // What do we do when the post succeeds?
            function (data) {
                // Re-enable the button.
                $.web2py.enableElement($("#add-post"));
                // Clears the form.
                self.vue.form_category = "";
                self.vue.form_title = "";
                self.vue.form_description = "";
                self.vue.form_price = "";
                self.vue.form_city = "";
                self.vue.form_image="";
                // Adds the post to the list of posts. 
                var new_post = {
                    id: data.post_id,
                    post_title: sent_title,
                    post_description: sent_description,
                    post_price: sent_price,
                    post_city: sent_city,
                    post_image: sent_image,
                    post_category: sent_category
                };
                self.vue.user_post_list.unshift(new_post);
                // We re-enumerate the array.
                self.process_posts();
                self.get_posts();
                
            });
        // If you put code here, it is run BEFORE the call comes back.
    };

    self.get_posts = function() {
        $.getJSON(get_user_post_list_url,
            function(data) {
                console.log(data.user_post_list);                
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.user_post_list = data.user_post_list;
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
        enumerate(self.vue.user_post_list);
        // We initialize the smile status to match the like. 
        self.vue.user_post_list.map(function (e) {
            // I need to use Vue.set here, because I am adding a new watched attribute
            // to an object.  See https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats
            // The code below is commented out, as we don't have smiles any more. 
            // Replace it with the appropriate code for thumbs. 
            // // Did I like it? 
            // // If I do e._smile = e.like, then Vue won't see the changes to e._smile . 
            // Vue.set(e, '_smile', e.like); 
            Vue.set(e, '_edit_post',false );
            Vue.set(e,'offer_list', []);
            Vue.set(e,'question_list',[]);
            Vue.set(e, 'clicked_applied', false); 
            Vue.set(e, 'offer_click', false); 
            Vue.set(e, 'question_click', false);         
            console.log(e);
            self.get_offer_list(e.id,e._idx);
            self.get_questions(e.id,e._idx);

        });
    };

    self.upload_file = function(event){
        console.log("upload_file");
        var input=event.target;
        var file = input.files[0];
        if (file){
            var reader = new FileReader();
            reader.addEventListener("load",function(){
                self.vue.form_image = reader.result;
            }, false);
            reader.readAsDataURL(file);
        }
    }

    self.open_post = function(post_idx){
        console.log("clicked");
    };

    self.delete_post = function(post_id, post_idx){
        $.post(delete_post_url,
            // Data we are sending.
            {
                post_id: post_id,
                
            },
            
            function (data) {
                // Re-enable the button.
                $.web2py.enableElement($("#delete-post"));
                // Adds the post to the list of posts. 
                self.vue.user_post_list.splice(post_idx,1);
                // hopefully reloads page
            });

        
    };

    //questions
    self.process_questions = function() {
        console.log("in process_questions");
        enumerate(self.vue.question_list);
        self.vue.question_list.map(function (e) {
            //Vue sets go here
            Vue.set(e, '_show_add_reply', false);
            Vue.set(e,'_edit_post',false);            
        });
    };

    self.get_questions = function(id,post_idx){
        $.getJSON(get_question_list_url,
            {
                post_id: id
            },
            function(data) {
                console.log(data.question_list);                
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
           
                self.vue.user_post_list[post_idx].question_list=data.question_list;
                enumerate(self.vue.user_post_list[post_idx].question_list);
                // Post-processing.
                self.process_questions();
            }
        );
        console.log("I fired the get");
    }

    self.add_answer = function(post_idx,question_idx){
        //disable reply button
        $.web2py.disableElement($("#add-answer"));
        //get content of reply
        var sent_content = self.vue.form_answer;
        console.log("add reply before post");
        console.log(sent_content);

        $.post(add_answer_url,
            // Data we are sending.
            {
                answer_content: sent_content,
                question_id: self.vue.user_post_list[post_idx].question_list[question_idx].id,
            },
            // What do we do when the post succeeds?
            function (data) {
                // Re-enable the button.
                $.web2py.enableElement($("#add-answer"));
                // Clears the form.
                self.vue.form_answer = "";
                // Adds the answer to the question.
                console.log("add reply data");
                console.log(data) 
                var new_answer = {
                    question_answer: sent_content,
                }
                console.log("new answer data");
                var p = self.vue.user_post_list[post_idx].question_list[question_idx];
                p.answer=sent_content;
                console.log("before process questions");
                self.process_questions();
                console.log("after process questions");
            });
    }; 

    
    self.update_post = function(post_idx){
        console.log("in update post");
        var p = self.vue.user_post_list[post_idx];
        p.post_image = self.vue.form_image;
        $.post(update_post_url,{
            post_id: p.id,
            post_description: p.post_description,
            post_price: p.post_price,
            post_title: p.post_title,
            post_city: p.post_city,
            post_image: p.post_image,
        });
    }

    self.get_offer_list = function(post_id,post_idx){
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

    //for image editing
    self.upload_file = function(event){
        console.log("upload_file");
        var input=event.target;
        var file = input.files[0];
        if (file){
            var reader = new FileReader();
            reader.addEventListener("load",function(){
                self.vue.form_image = reader.result;
            }, false);
            reader.readAsDataURL(file);
        }
    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            form_category: "",
            form_title: "",
            form_description: "",
            form_price:"",
            form_city:"",
            form_image:"",
            user_post_list: [],
            show_form: false,
            show_questions: false,
            question_list: [],
            form_question: "",
            form_answer: "",
            form_image:"",
            upload_file: self.upload_file,
            
        },
        methods: {
            add_post: self.add_post,
            open_post: self.open_post,
            upload_file: self.upload_file,
            delete_post: self.delete_post,
            get_questions: self.get_questions,
            add_answer: self.add_answer,
            update_post: self.update_post,
            get_offer_list: self.get_offer_list,
            get_questions : self.get_questions,
        }

    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    // Gets the posts.
    self.get_posts();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
