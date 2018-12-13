# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.




# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)


import datetime

def get_user_email():
    return None if auth.user is None else auth.user.email

def get_current_time():
    return datetime.datetime.utcnow()

def get_username():
    return None if auth.user is None else auth.user.username

db.define_table('post',
                Field('post_username', default=get_username()),
                Field('post_city'),
                Field('post_price'),
                Field('post_image','text', default=None),
                Field('post_category'),
                Field('post_author', default=get_user_email()),
                Field('post_title'),
                Field('post_description', 'text'),
                Field('post_time', 'datetime', default=get_current_time()),
                )

db.define_table('post_id',
                Field('post_id'),
                Field('email', default=get_user_email()),
                )

db.define_table('question',
                Field('question_post_id'),
                Field('question_post_author_email','text',default=""), #post maker who answered the question
                Field('question_post_author_username','text',default=""), #post maker who answered the question
                Field('question_question','text'),
                Field('question_answer','text',default=""),
                Field('question_time',default=get_current_time()),
                Field('question_author_email',default=get_user_email()), #user who asks question
                Field('question_author_username',default=get_username()), #user who asks question
                )
db.define_table('offer',
                Field('offer_post_id'),
                Field('offer_price'),
                Field('offer_user_email',default=get_user_email()),
                Field('offer_user_username',default=get_username()),
                )