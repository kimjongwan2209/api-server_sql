const index = require("./index.js");
const link_index = index;

//comment_id 확인
function comment_id_check(comment_id) {
  const sql = "select comment_id from comment_table where comment_id = ?";

  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [comment_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//댓글 작성
function create(user_id, post_id, comment_post) {
  const sql =
    "insert into comment_table(user_id, post_id, comment_post, comment_date) values (?,?,?,now())";

  link_index.query(sql, [user_id, post_id, comment_post], (error, result) => {
    if (error) {
      throw error;
    }

    return result;
  });
}

//댓글 조회
function findAll(comment_id) {
  const sql = `SELECT comment_table.*, like_num from comment_table 
  JOIN (SELECT comment_id, COUNT(*) AS like_num FROM comment_like_table GROUP BY comment_id) AS A
  ON comment_table.comment_id = A.comment_id 
  WHERE comment_table.comment_id =?`;
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [comment_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//댓글 수정
function update(user_id, post_id, comment_id, comment_post) {
  const sql =
    "update comment_table set comment_post = ? where post_id= ? and comment_id = ? and user_id = ?";
  const promise = new Promise((resolve, reject) => {
    link_index.query(
      sql,
      [comment_post, post_id, comment_id, user_id],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });
  return promise;
}

//댓글 삭제
function delete_comment(user_id, post_id, comment_id) {
  const sql =
    "delete from comment_table where post_id= ? and comment_id = ? and user_id = ?";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [post_id, comment_id, user_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//댓글 좋아요

function like_comment(user_id, comment_id) {
  const sql =
    "insert into comment_like_table(user_id, comment_id) values (?,?)";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [user_id, comment_id], (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
  return promise;
}

//댓글 좋아요 갯수 조회

function like_count(user_id, comment_id) {
  const sql =
    "select count(*) as NUM  from comment_like_table where user_id=? and comment_id=?";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [user_id, comment_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//좋아요 테이블을 검증

function checked_comment(user_id, comment_id) {
  const sql =
    "select count(*) as NUM  from comment_like_table where user_id=? and comment_id=?";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [user_id, comment_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//댓글 좋아요 삭제

function cancel_like(user_id, comment_id) {
  const sql =
    "delete from comment_like_table where user_id= ? and comment_id = ?";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [user_id, comment_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

module.exports = {
  link_index,
  create,
  update,
  findAll,
  delete_comment,
  like_comment,
  cancel_like,
  like_count,
  comment_id_check,
  checked_comment,
};
