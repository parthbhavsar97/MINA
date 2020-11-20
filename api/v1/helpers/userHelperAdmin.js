const promise = require('bluebird')
const db = require('../../utils/db')
const passwordHelper = require('../../utils/passwordHelper')
const dateHelper = require('../../utils/dateHelper')
const userHelper = require('./userHelper')

class UserHelper {

   async getUsers(body) {
      try {
         let where = ` is_deleted=0 AND CONCAT(name, ' ', surname) ILIKE ('%${body.search_name}%') `
         let limit = body.limit
         let selectParams = '*'
         let pagination = ` ORDER BY user_id DESC OFFSET ${(Number(body.page_no) - 1) * Number(limit)} LIMIT ${limit}`
         let data = await db.select('users', selectParams, where + pagination)
         let totalCount = await db.select('users', `COUNT(*)`, where)
         return { data: data, total: Number(totalCount[0].count) }
      } catch (error) {
         throw error
      }
   }

   async getUsersForVideoHub(body) {
      try {
         let where = ` is_deleted=0 AND is_active=1 AND CONCAT(name, ' ', surname) ILIKE ('%${body.search_name}%')`
         let limit = body.limit
         let selectParams = '*'
         let pagination = ` ORDER BY user_id DESC OFFSET ${(Number(body.page_no) - 1) * Number(limit)} LIMIT ${limit}`
         let data = await db.select('users', selectParams, where + pagination)
         let totalCount = await db.select('users', `COUNT(*)`, where)
         return { data: data, total: Number(totalCount[0].count) }
      } catch (error) {
         throw error
      }
   }

   async deleteUser(body) {
      try {
         let data = {
            is_deleted: 1,
            modified_date: dateHelper.getCurrentTimeStamp()
         }
         await db.update('users', `user_id = ${body.id}`, data)
         return true
      } catch (error) {
         throw error
      }
   }

   async deleteRequestForUserAndVideos(body) {
      try {
         let data = {
            is_deleted: 1,
            modified_date: dateHelper.getCurrentTimeStamp()
         }
         await db.update('video_requests', `user_id = ${body.id}`, data)
         return true
      } catch (error) {
         throw error
      }
   }

   async getUserById(user_id) {
      try {
         let user = await db.select('users', '*', ` user_id = ${user_id} AND is_deleted = 0 `)
         if (user && user[0]) {
            return user[0]
         } else {
            throw 'USER_NOT_FOUND'
         }
      } catch (error) {
         throw error
      }
   }

   async addUser(body) {
      try {
         let data = {
            email: body.email,
            password: await passwordHelper.getPasswordHash(body.password),
            created_date: dateHelper.getCurrentTimeStamp(),
            modified_date: dateHelper.getCurrentTimeStamp()
         }
         let res = await db.insert('users', data)
         return res
      } catch (error) {
         throw error
      }
   }

   async updateUser(body) {
      try {
         let data = {
            name: body.name,
            surname: body.surname,
            address: body.address,
            country_code: body.country_code,
            phone_number: body.phone_number,
            email: body.email,
            modified_date: dateHelper.getCurrentTimeStamp()
         }

         let res = await db.update('users', ` user_id = ${body.id} `, data)
         return true
      } catch (error) {
         throw error
      }
   }


   async getVideoRequests(body) {
      try {
         let where = ` video_requests.is_active=1 AND video_requests.is_completed = 0 AND video_requests.is_deleted = 0 AND CONCAT(users.name, ' ', users.surname) ILIKE ('%${body.search_name}%')`
         let limit = body.limit
         let selectParams = 'video_requests.*, users.name, users.surname, users.email, array(select image_url from request_images where request_id = video_requests.request_id ) as images, (select reason from videos where video_requests.request_id = videos.request_id) as reason, (select reason2 from videos where video_requests.request_id = videos.request_id) as reason2,  (select frameio_video_id from videos where video_requests.request_id = videos.request_id) as frameio_video_id '
         // let join = ` JOIN users ON users.user_id = video_requests.user_id JOIN videos on videos.request_id = video_requests.request_id `
         let join = ` JOIN users ON users.user_id = video_requests.user_id `
         let pagination = ` ORDER BY request_id DESC OFFSET ${(Number(body.page_no) - 1) * Number(limit)} LIMIT ${limit}`
         let data = await db.select('video_requests' + join, selectParams, where + pagination)
         let totalCount = await db.select('video_requests' + join, `COUNT(*)`, where)
         return { data: data, total: Number(totalCount[0].count) }
      } catch (error) {
         throw error
      }
   }

   async getVideoRequestHistory(body) {
      try {
         let where = ` video_requests.is_active=1 AND video_requests.is_completed = 1 AND video_requests.is_deleted = 0 AND CONCAT(users.name, ' ', users.surname) ILIKE ('%${body.search_name}%')`
         let limit = body.limit
         let selectParams = 'video_requests.*, users.name, users.surname, users.email, array(select image_url from request_images where request_id = video_requests.request_id ) as images, (select reason from videos where video_requests.request_id = videos.request_id) as reason, (select reason2 from videos where video_requests.request_id = videos.request_id) as reason2, (select frameio_video_id from videos where video_requests.request_id = videos.request_id) as frameio_video_id '
         // let join = ` JOIN users ON users.user_id = video_requests.user_id JOIN videos on videos.request_id = video_requests.request_id `
         let join = ` JOIN users ON users.user_id = video_requests.user_id `
         let pagination = ` ORDER BY modified_date DESC OFFSET ${(Number(body.page_no) - 1) * Number(limit)} LIMIT ${limit}`

         if (body && body.from_date) {
            where = where + ` AND request_date >='${body.from_date}' AND request_date <= '${body.to_date}'`
         }

         let data = await db.select('video_requests' + join, selectParams, where + pagination)
         let totalCount = await db.select('video_requests' + join, `COUNT(*)`, where)
         return { data: data, total: Number(totalCount[0].count) }
      } catch (error) {
         throw error
      }
   }

   async completeVideoRequest(body) {
      try {
         let data = {
            is_completed: 1,
            modified_date: dateHelper.getCurrentTimeStamp()
         }
         await db.update("video_requests", `request_id = ${body.request_id}`, data)
         return true
      } catch (error) {
         throw error
      }
   }

   async activateFinalVideo(body, video_request) {

      try {
         let data = {
            user_id: body.id,
            is_active: 1,
            category_id: body.category_id,
            frameio_video_id: body.frameio_video_id,
            download_url: body.download_url,
            request_id: video_request.request_id,
            created_date: dateHelper.getCurrentTimeStamp(),
            modified_date: dateHelper.getCurrentTimeStamp()
         }
         let video = await db.insert('videos', data)
         return video

      } catch (error) {
         throw error
      }
   }

   async isVideoAlreadyActivated(body) {
      try {
         let video = await db.select('videos', '*', ` frameio_video_id = '${body.frameio_video_id}' AND user_id = ${body.id} `)
         if (video && video[0]) {
            throw "VIDEO_ALREADY_ACTIVATED"
         } else {
            return true
         }
      } catch (error) {
         throw error
      }
   }

   async getUserbrandProfileByUserId(user_id) {
      try {
         let brand_profile = await db.select('brands', '*', ` user_id = ${user_id} `)
         if (brand_profile && brand_profile[0]) {
            return brand_profile[0]
         } else {
            return {}
         }
      } catch (error) {
         throw error
      }
   }

   async getUserBusinessProfile(user_id) {
      try {
         let business_profile = await db.select('business', '*', ` user_id = ${user_id} `)
         if (business_profile && business_profile[0]) {
            return business_profile[0]
         } else {
            return {}
         }
      } catch (error) {
         throw error
      }
   }

   async getVideoReviews(body) {
      try {
         let where = ` (videos.quality <> 0 or videos.turnaround <> 0 or videos.comment is not null) AND CONCAT(users.name, ' ', users.surname) ILIKE ('%${body.search_name}%')`
         let limit = body.limit
         let join = ` JOIN users on users.user_id = videos.user_id `
         let selectParams = 'videos.*, users.name, users.email, users.surname'
         let pagination = ` ORDER BY videos.video_id DESC OFFSET ${(Number(body.page_no) - 1) * Number(limit)} LIMIT ${limit}`
         let data = await db.select('videos' + join, selectParams, where + pagination)
         let totalCount = await db.select('videos' + join, `COUNT(*)`, where)
         return { data: data, total: Number(totalCount[0].count) }
      } catch (error) {
         throw error
      }
   }

   async getVideoReviewByVideoId(body) {
      try {
         let video = await db.select('videos', '*', `video_id = ${body.video_id}`)
         return video[0]
      } catch (error) {
         throw error
      }
   }

   // async getUserDetails(body) {
   //    try {

   //       let res = await db.select('users', ` *,  `, ` user_id = ${body.id} `)
   //       return res[0]
   //    } catch (error) {
   //       throw error
   //    }
   // }


   async getVideoRequest(user) {
      try {
         let request = await db.select("video_requests", "*", `user_id = ${user.user_id} ORDER BY request_id DESC`)
         return request[0] || {}
      } catch (error) {
         throw error
      }
   }

   async getUserRequestAndFinalVideoDetailsById(user_id) {
      try {
         let video = await userHelper.getVideosFromTableByUserId(user_id)
         let request = await this.getVideoRequest({ user_id: user_id })
         console.log(request)
         return {
            video_status: video && video[0] ? video[0].status : 0,
            request_status: request && request.status ? request.status : 4,
            frameio_video_id: video && video[0] ? video[0].frameio_video_id : "abc",
            is_video_added: request && request.is_video_added == 0 ? request.is_video_added : 1,
         }
      } catch (error) {
         throw error
      }
   }

   async updateVideoRequest(request, body) {
      try {
         let data = {
            is_video_added: 1,
            modified_date: dateHelper.getCurrentTimeStamp()
         }

         if (body.last_status == 2) {
            data.is_completed = 1
            data.status = 3
         }
         await db.update("video_requests", `request_id = ${request.request_id}`, data)
         return true
      } catch (error) {
         throw error
      }
   }

   async updateFinalVideo(body, video) {
      try {
         let data = {
            frameio_video_id: body.frameio_video_id,
            download_url: body.download_url,
            modified_date: dateHelper.getCurrentTimeStamp()
         }
         if (body.last_status == 2) {
            data.status = 3
         }
         let updated_video = await db.update('videos', `video_id = ${video.video_id}`, data)
         return updated_video
      } catch (error) {
         throw error
      }
   }

}

module.exports = new UserHelper()
