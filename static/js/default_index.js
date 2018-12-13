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
        $.post(add_post_url,
            // Data we are sending.
            {
                post_title: self.vue.form_title,
                post_description: self.vue.form_description,
                post_price: self.vue.form_price,
                post_city: self.vue.form_city,
            },
            // What do we do when the post succeeds?
            function (data) {
                // Re-enable the button.
                $.web2py.enableElement($("#add-post"));
                // Clears the form.
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
                    post_image: sent_image
                };
                self.vue.post_list.unshift(new_post);
                // We re-enumerate the array.
                self.process_posts();
            });
        // If you put code here, it is run BEFORE the call comes back.
    };

    self.get_posts = function() {
        var array = [];
        if (arguments.length === 0){
            array.push('newest');
            array.push('order');
            console.log(array)
        }
        else {
            array.push(arguments[0]);
            array.push(arguments[1]);
            console.log(array);
        }
        var json_string = JSON.stringify(array);
        $.getJSON(get_post_list_url,
            {
                filter: json_string
            },
            function(data) {
                console.log(data.post_list);
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.post_list = data.post_list;
                console.log(self.vue.post_list[0].post_title);
                // Post-processing.
                self.process_posts();
            }
        );
        console.log("I fired the get");
        console.log(self.vue.post_list);
    };

    self.get_unique_categories = function(){
        var array = [];
        console.log(array);
        array.push('newest');
        array.push('order');
        var json_string = JSON.stringify(array);
        $.getJSON(get_post_list_url,
            {
                filter: json_string,
            },
            function(data) {
                var unique_list = [];
                for (var i = 0; i < data.post_list.length; i++){
                    if (data.post_list[i].post_category != null)
                        unique_list.push(data.post_list[i].post_category);
                }
                self.vue.unique_categories = Array.from(new Set(unique_list));
                console.log(self.vue.unique_categories);
            }
        );
    };

    self.print_categories = function(list){
        for (var i = 0; i < list.length; i++){
            console.log(list[i]);
        }
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

    self.push_post_id = function(id){
        console.log("in push post id");
        $.post(push_post_id_url,{
            post_id: id,
        })
    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            form_title: "",
            form_description: "",
            form_price:"",
            form_city:"",
            form_image:"",
            post_list: [],
            _add_post: false,
            search_input:"",            
            unique_categories:[],
            showMenu: false,
            clicked_categories: false,
        },
        methods: {
            add_post: self.add_post,
            open_post: self.open_post,
            push_post_id: self.push_post_id,
            get_posts: self.get_posts,
            
        }

    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    // Gets the posts.
    self.get_posts();

    self.get_unique_categories();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
