/** A script to populate the DB with dummy data */

import 'dotenv/config.js';
import mongoose from 'mongoose';
import Posts from './src/models/postsModel';
import Comments from './src/models/commentsModel';

const connectToDb = async () => {
  console.log('connecting to database...');
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('connected');
  } catch (error) {
    console.error(error);
  }
};

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla justo viverra, mattis purus ac, dictum magna. Nunc ex dolor, molestie a mauris sed, convallis hendrerit libero. Sed hendrerit metus porttitor, interdum leo eget, placerat lorem. Nam viverra id velit nec vestibulum. Nullam pulvinar ligula finibus tempor malesuada. Vestibulum sed placerat nisi. Nam tempor pellentesque gravida. Aliquam cursus tortor eu risus auctor tempus.\n Morbi pharetra rhoncus ligula sed pharetra. Mauris in tellus in lacus scelerisque vulputate. Suspendisse ac ante odio. Aliquam euismod purus vel fermentum feugiat. Vestibulum sodales sapien vitae dolor eleifend, lobortis ullamcorper est ornare. Phasellus commodo massa eu orci pulvinar pretium. Pellentesque tincidunt elementum dui sit amet interdum. Morbi sed sagittis nisi. Nam pretium, dolor id sagittis fringilla, sapien quam facilisis quam, nec pellentesque mi quam non massa. Morbi ornare, erat ut ornare semper, quam leo tempus purus, sit amet rutrum mauris lacus nec libero. Etiam a molestie neque. Sed faucibus tortor ac mi auctor cursus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam tincidunt nunc sed est mattis ullamcorper. Vivamus a feugiat diam.\nQuisque ultricies, felis quis eleifend condimentum, orci lacus tempor nibh, nec venenatis urna tellus aliquet tortor. Fusce sed elementum augue, eget laoreet lorem. Pellentesque rutrum commodo diam id porta. Cras est ligula, imperdiet pharetra erat quis, ullamcorper sagittis lacus. Ut nibh urna, maximus et nulla vel, volutpat imperdiet risus. Sed at lacus cursus, volutpat ligula ac, rhoncus turpis. Vivamus eget rhoncus nunc.\nNam tempor tempus sollicitudin. Curabitur ac nunc at ipsum viverra molestie. Donec viverra ipsum sed mollis iaculis. Nam interdum cursus rhoncus. Ut ornare porta ante hendrerit consectetur. Nunc gravida nunc at tortor tincidunt, sit amet convallis ligula lobortis. Vivamus nisi ligula, fermentum convallis arcu ut, tincidunt hendrerit turpis. Aliquam ipsum metus, blandit vel vehicula blandit, luctus quis odio. Sed pharetra varius ex sed semper. Quisque non sodales nunc, vel ullamcorper dolor. Fusce cursus congue nulla, vitae ultrices dui scelerisque a. Nulla sollicitudin tortor non risus maximus commodo. Fusce luctus maximus est, sit amet aliquet eros mollis ut. Maecenas non lorem at enim laoreet iaculis id sit amet purus.\nNam augue mauris, mattis a cursus at, rhoncus varius diam. Fusce rutrum, ante posuere consectetur hendrerit, lacus felis porta turpis, sed feugiat mi lacus et augue. Nulla nulla sem, convallis a facilisis vel, pellentesque et arcu. In nec malesuada elit. Curabitur at erat eget lectus pulvinar elementum id ac dolor. Nullam vulputate, magna non pharetra dignissim, ipsum ligula vulputate dolor, vel lacinia tortor lacus non eros. Duis nec nibh nulla. Curabitur ut dapibus ex. Duis nec mollis diam. Aenean accumsan et ante eget ultrices.';

const addPost = async (title: string) => {
  try {
    const newPost = new Posts({
      title,
      text,
      author: '652d7f4900adfe262fa57951',
    });
    await newPost.save();
    console.log(`Post: ${newPost.id} added.`);
    const newComment1 = new Comments({
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla justo viverra, mattis purus ac, dictum magna.',
      author: 'test comment',
    });
    const newComment2 = new Comments({
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla justo viverra, mattis purus ac, dictum magna.',
      author: 'test comment',
    });
    const newComment3 = new Comments({
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla justo viverra, mattis purus ac, dictum magna.',
      author: 'test comment',
    });
    await newComment1.save();
    newPost.comments.push(newComment1._id);
    console.log(`Comment: ${newComment1.id} is added to Post: ${newPost.id}`);
    await newComment2.save();
    newPost.comments.push(newComment2._id);
    console.log(`Comment: ${newComment2.id} is added to Post: ${newPost.id}`);
    await newComment3.save();
    newPost.comments.push(newComment3._id);
    console.log(`Comment: ${newComment3.id} is added to Post: ${newPost.id}`);
    await newPost.save();
    console.log('All comments added');
  } catch (error) {
    console.error(error);
  }
};

connectToDb();

let count = 0;

const interval = setInterval(() => {
  addPost(`Test Post ${count + 1}`);
  console.log(count);
  count++;
  if (count >= 30) clearInterval(interval);
}, 2000);
