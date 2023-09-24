import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { profile } from 'console';
import { User } from 'src/database/user.entity';
import { update } from 'src/Dto/use.Dto';
import { JWToken } from 'src/auth/jwt.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from './profile.service';
import { checkPasswordStrength } from 'src/utils/passwordChecker';
import { FriendsService } from 'src/friends/friends.service';
import { BlockedUser } from 'src/database/blockedUser.entity';
import { BlockedService } from 'src/blocked/blocked.service';
import { GameService } from 'src/game/game.service';

@Controller('profile')
export class ProfileController {
    constructor (private readonly userservice:UserService,private readonly profileService:ProfileService, private readonly friendsService: FriendsService ,private readonly jwt:JWToken, private readonly blockedService: BlockedService, private readonly gameService:GameService){}

    @Get(':username')
    async display(@Param('username') username:String,@Res() res){
        if (username) {
            try{
            // console.log(username);
            const user = await this.profileService.findByName(username);
            if (user)
            {
                // console.log(user.stats);
                const matches = await this.gameService.getGameInvites(user.id);
                delete user.password;
                // console.log("-------- ", user.id);
                const details = await this.friendsService.getUserFriends(user.username);
                const details2 = await this.blockedService.getblocked(user.id);
                // console.log(details);
                // console.log("**************************");
                // console.log(details2);
                // console.log("user matches is == ",user.stats.matches);
                
                const info = {
                    user:user, 
                    friends:details,
                    blocked:details2,
                    matches:matches
                }
                res.send(info);
            }
            else
                res.send({message: "not-found"});
            } catch (error)
            {
                console.error('Error getting the friends of the user: ',error.message);
                throw error;
            }
        }
    }
    @Put('update/:id')
    async update(@Body() Body:Partial<User>,@Res() res,@Param('id') id:number){
        // console.log("\n\n\n\n\n\nFKJDFKJDSKGDSKHGD\n\n\n\n\n\n\n\n")
        if (Body)
        {
            // console.log("Body = "+ Body.username);
            // if (!Body.username)
            // {
            //     res.send({messgae:'empty'});
            //     //return;
            // }
            // console.log("Username =="+ Body.username)
            const exist = await this.userservice.findByName(Body.username);

            // console.log('******exist = ' + JSON.stringify(exist) )
            if (!exist)
            {
                const usersec = await this.userservice.findById(id); 
                if (usersec){
                    if (Body.password && checkPasswordStrength(Body.password) == 'Weak')
                    {
                        res.send({message:'weak'})
                   // return;
                    }
                    if (Body.password)
                        Body.password = await this.userservice.hashpassword(Body.password);
                    if ( !Body.password )
                        Body.password = usersec.password;
                    if(!Body.username)
                        Body.username = usersec.username;
                    if (!Body.avatar_url)
                        Body.avatar_url = usersec.avatar_url;
                    if (!Body.Bio)
                        Body.Bio = usersec.Bio;
                    if (Body.privacy == null)
                        Body.privacy = usersec.privacy;
                    await this.userservice.update(Body,id);
                    const user = await this.userservice.findById(id); 
                    // console.log(user.stats);
                    const token = await this.jwt.generateToken_2(user);
            
                    // console.log(await this.jwt.decoded(token));
                    res.send({message:'success',token:token});
                }
                else
                    res.send({message:'invalid id',status:'failure'})
            }
            else
                res.send({message:'exists',status:'failure'})
        }
        else {
            res.send({message:'error'});
        }
    }
}