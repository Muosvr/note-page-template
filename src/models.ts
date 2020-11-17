import mongoose from 'mongoose';
const { Schema } = mongoose;

const pageSchema = new Schema({
  blockIds: {},
  blockProps: {},
  elementProps: {},
  pageProps: {},
  pageId: {
    type: String,
    index: true,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  published: Boolean
})
// interface PageType {
//   blockIds: {
//     [index: string]: [string]
//   },
//   blockProps: {
//     [index: string]: any
//   }
// }


export const Page = mongoose.model('Page', pageSchema);

const userSchema = new Schema({
  username: {
    type: String,
    // required: 'Username is required',
    index: true
  },
  password: {
    type: String,
    // required: 'Password is required'
  },
  githubUsername: {
    type: String,
    index: true
  },
  githubToken: {
    type: String,
  }
})

userSchema.virtual('id').get(function(){
  return this._id
})

export const User = mongoose.model('User', userSchema);