import moment from 'moment';
import {Avatar} from 'antd';
import PostImage from '../images/PostImage';
import {HeartOutlined, HeartFilled, CommentOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { imageSource } from '../../functions';
import Link from 'next/link';
import { UserContext } from '../../context';
import {useContext} from 'react';
import { useRouter } from 'next/router';

const Post = ({post, handleDelete, handleLike, handleUnlike, handleComment, commentsCount = 100, removeComment}) => {
    const [state] = useContext(UserContext);
    const router = useRouter();

    

    return ( 
        <>
            {post && post.postedBy && (
                <div key={post._id} className="card mb-5">
                    <div className="card-header">
                        {/* <Avatar size={40}>{post.postedBy.name[0]}</Avatar> */}
                        <Avatar size={40} src={imageSource(post.postedBy)} />
                        <span className="pt-2 ml-3" style={{marginLeft:"1rem"}}>{post.postedBy.name}</span>
                        <span className="pt-2 ml-3" style={{marginLeft:"1rem"}}>{moment(post.createdAt).fromNow()}</span>
                    </div>
                    <div className="card-body">
                        {post.content}
                    </div>
                    <div className="card-footer">
                        {post.image && <PostImage url={post.image.url}/>}

                        <div className="d-flex pt-2 justify-content-between">
                        <div className="justify-content-between">
                            {state && state.user && post.likes && post.likes.includes(state.user._id) ? (
                            <HeartFilled onClick={() => handleUnlike(post._id)} className="text-danger pt-2 h5"/>
                                ) : (
                            <HeartOutlined onClick={() => handleLike(post._id)} className="text-danger pt-2 h5"/>
                                ) 
                            } 
                            <br/> 
                            <div>{(post.likes.length === 1) ? (
                                <h6>{post.likes.length} like</h6>
                            ) : (
                                <h6>{post.likes.length} likes</h6>
                            )
                            } </div>
                        </div>      
                        <div className="justify-content-between">
                            <CommentOutlined
                                onClick={() => handleComment(post)}
                                className="text-primary pt-2 h5 px-2"
                            />
                                <div>{(post.comments.length === 1) ? (
                                    <a href={`/post/${post._id}`}><h6 className="text-primary">{post.comments.length} comment</h6></a>
                                ) : (
                                    <a href={`/post/${post._id}`}><h6 className="text-primary">{post.comments.length} comments</h6></a>
                                )
                                } 
                                </div>
                            </div>

                            {state && state.user && state.user._id === post.postedBy._id && (
                                <div className='justify-content-between'>
                                <span className='p-3'>
                                    <button onClick={() => router.push(`/user/post/${post._id}`)} className='btn btn-sm btn-info'>Edit</button>            
                                </span>
                                <span className='p-3'>
                                  <button className='btn btn-sm btn-danger' onClick={() => handleDelete(post)}>Delete</button>
                                </span>
                              </div>
                            )}    
                        </div>    
                    </div>
                    {post.comments && post.comments.length > 0  && (
                        <ol className='list-group' style={{maxHeight: '625px', overflow: 'scroll'}}>
                            {post.comments.slice(0, commentsCount).map((c) => (
                                <li key={c._id} className='list-group-item d-flex justify-content-between align-items-start'>
                                <div className='ms-2 me-auto'>
                                   <div>
                                        <Avatar size={20} className='mb-1 mr-3' src={imageSource(c.postedBy)} />
                                        &nbsp;{c.postedBy.name}
                                    </div>
                                    <i className='text-muted'>
                                        {c.text}
                                    </i>                                   
                                </div>
                                <span className='badge rounded-pill text-muted'>
                                    {moment(c.created).fromNow()}
                                    {state && state.user && state.user._id === c.postedBy._id && (
                                        <div className="ml-auto mt-1">
                                            <DeleteOutlined onClick={() => removeComment(post._id, c)} className="pl-2 text-danger" />
                                        </div>
                                    )}
                                </span> 
                            </li>  
                            ))}       
                        </ol>
                    )}
                </div>
            )}
        </>
    );
}
 
export default Post;