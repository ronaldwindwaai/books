 (function() {
              var global = global||this,
                APIGEE_ORGNAME="6c03e92a-8fac-11e4-8a3d-050f9857a288",
                APIGEE_APPNAME="f184d120-90f8-11e4-9608-611dfeb68e8e";
                if("undefined"===typeof APIGEE_ORGNAME || "Your Org Name" === APIGEE_ORGNAME){
                    APIGEE_ORGNAME=prompt("What is the Organization Name you registered at http://apigee.com/usergrid ?\n(you can set this permanently on line 14)", "ORG NAME");
                }
                if("undefined"===typeof APIGEE_APPNAME || "Your App Name" === APIGEE_APPNAME){
                    APIGEE_APPNAME=prompt("What is the App Name you created at http://apigee.com/usergrid ?\n(you can set this permanently in on line 15)", "sandbox");
                }
                global.APIGEE_ORGNAME=APIGEE_ORGNAME;
                global.APIGEE_APPNAME=APIGEE_APPNAME;
            })();


if("undefined"===typeof APIGEE_ORGNAME){
                APIGEE_ORGNAME=prompt("What is the Organization Name you registered at http://apigee.com/usergrid ?\n(you can set this permanently in config.js)", "ORG NAME");
            }
            if("undefined"===typeof APIGEE_APPNAME){
                APIGEE_APPNAME="sandbox";
            }
            //We start by creating an  instance of Apigee.Client to carry our App Services credentials        
            var apigee = new Apigee.Client({
                orgName:APIGEE_ORGNAME,
                appName:APIGEE_APPNAME,
        logging: true, //optional - turn on logging, off by default
        buildCurl: true //optional - log network calls in the console, off by default

                
            });
            
            // If you lock down your sandbox or use any other app
            // a user login is required to access the data.
            //apigee.login("myuser","mypass");

            // We now define my_books within the global scope
            var my_books = new Apigee.Collection( { "client":apigee, "type":"books" } );


            $(document).ready(function () {
                $('#create-button').bind('click', createBook);
                
                loadBooks();
            });

            function loadBooks () {
                
                my_books.fetch( // Actual network call

                    // Success Callback
                    function () {
                        $('#books-list').empty();
                        
                        while ( my_books.hasNextEntity() ) {
                            var current_book = my_books.getNextEntity();

                            // Output the book on the page
                            $('#books-list').append('<li><h3>'+current_book.get('title')+'</h3><p>'+current_book.get('author')+'</p></li>');
                        }
                        
                        // Re-apply jQuery Mobile styles
                        $('#books-list').listview('refresh');
                    },

                    // Failure Callback
                    function () { alert("read failed"); }
                );
            }

            function createBook() {

                new_book = { "title":$("#title-field").val(),
                                "name":$("#title-field").val(),
                            "author":$("#author-field").val() };

                my_books.addEntity(new_book, function (error, response) {
                    if (error) {
                        alert('write failed');
                    } else {
                        $("#title-field").val(""), $("#author-field").val("");
                        loadBooks();
                        history.back();
                    }
                });
            }