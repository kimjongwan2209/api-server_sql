const index = require("./index.js");
const link_index = index;

//post_id 확인
function post_id_check(post_id) {
  const sql = "select * from gallery_table where post_id =?";

  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [post_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//게시글 작성확인
function create(user_id, gallery_post) {
  const sql =
    "insert into gallery_table(user_id, gallery_post, gallery_date) values(?,?,now())";

  link_index.query(sql, [user_id, gallery_post], (error, result) => {
    if (error) {
      console.log(error);
      throw error;
    }
    return result;
  });
}

// 게시글 전체조회

function findAll() {
  const sql =
    "SELECT gallery_table.user_id, gallery_table.post_id, gallery_date, gallery_post,COUNT(*) AS comment_num \
  from gallery_table LEFT OUTER JOIN comment_table on gallery_table.post_id = comment_table.post_id \
  group by gallery_table.user_id, gallery_table.post_id, gallery_date, gallery_post \
  order by post_id DESC";

  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//게시글 단건조회
function findOne(post_id) {
  const sql = `
  select gallery_table.user_id, gallery_table.post_id, gallery_table.gallery_post, gallery_table.gallery_date, COUNT(*) AS like_num 
  from gallery_table JOIN gallery_like_table ON gallery_table.post_id = gallery_like_table.post_id 
  WHERE gallery_table.post_id = ?
  group BY gallery_table.user_id, gallery_table.post_id, gallery_table.gallery_post, gallery_table.gallery_date`;

  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [post_id], (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
  return promise;
}

//게시글 수정
function update(user_id, post_id, gallery_post) {
  const sql =
    "update gallery_table set gallery_post = ? where user_id = ? and post_id = ?";

  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [gallery_post, user_id, post_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//게시글 삭제

function delete_gallery(user_id, post_id) {
  const sql = "delete from gallery_table where user_id=? and post_id= ? ";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [user_id, post_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//게시글 좋아요 갯수 조회

function like_count(user_id, post_id) {
  const sql =
    "select count(*) as NUM  from gallery_like_table where user_id=? and post_id=?";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [user_id, post_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//좋아요 테이블을 검증

function checked_post(user_id, post_id) {
  const sql =
    "select count(*) as NUM  from gallery_like_table where user_id=? and post_id=?";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [user_id, post_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//게시글 좋아요
function like_gallery(user_id, post_id) {
  const sql = "insert into gallery_like_table(user_id, post_id) values (?,?)";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [user_id, post_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//게시글 졿아요 취소

function cancel_like(user_id, post_id) {
  const sql = "delete from gallery_like_table where user_id=? and post_id=?";
  const promise = new Promise((resolve, reject) => {
    link_index.query(sql, [user_id, post_id], (error, result) => {
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
  findAll,
  findOne,
  update,
  delete_gallery,
  like_count,
  like_gallery,
  cancel_like,
  post_id_check,
  checked_post,
};
