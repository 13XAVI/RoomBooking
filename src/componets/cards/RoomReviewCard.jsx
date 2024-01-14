import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { CiLocationArrow1 } from 'react-icons/ci';
import { FaLocationDot } from 'react-icons/fa6';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


export default function RoomReviewCard({ roomData }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {roomData.map((room, index) => (
        <Card key={index} sx={{ maxWidth: 420, margin: 2 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="rra">
                RRA
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={`Room ${index + 1}`}
            subheader="September 14, 2016"
          />
          <CardMedia>
            <img src={room.imagePath} alt={`Room ${index}`} style={{ width: '100%', height: '100%' }} />
          </CardMedia>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              This impressive paella is a perfect party dish and a fun meal to cook together with your guests.
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <BsFillBookmarkPlusFill />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent style={{display:"flex"}}>
              <Typography paragraph>Description:</Typography>
              <Typography paragraph >
                {room.roomDescription}
              </Typography>
              <FaLocationDot style={{marginLeft: 10}}/>
              <Typography paragraph style={{marginLeft: 2}}>Location:</Typography>
              <Typography>
                {room.roomLocation}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </>
  );
}