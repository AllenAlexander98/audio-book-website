import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { styled } from "@mui/system";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Layout from "../../components/layout/Layout";
import ReactAudioPlayer from "react-audio-player";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from "axios";

// import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// import SkipNextIcon from '@mui/icons-material/SkipNext';
// import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
// import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
// import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined';

const UnitItem = styled("div")((props) => ({
  backgroundColor: props.active ? "rgba(196, 196, 196, 0.3)" : "",
  display: "flex",
  padding: "0px 12px",
  alignItems: "center",
  width: "100%",
  height: "56px",
  borderRadius: "6px",
  cursor: "pointer",
  minWidth: "266px",
  ":hover": {
    backgroundColor: "rgba(196, 196, 196, 0.3)",
  },
}));

const Index = ({ book, audios }) => {
  const router = useRouter();
  const [audioIndex, setAudioIndex] = useState(0);

  return (
    <>
      <Container sx={{ marginBottom: 4 }} component="main" maxWidth="lg">
        <Box sx={{ height: "auto", width: "100%", padding: "38px 0px" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={4}>
              <Grid item xs="auto">
                <Box sx={{ width: 312, height: "auto" }}>
                  <Avatar
                    variant="square"
                    sx={{ width: 312, height: 312, borderRadius: 6 }}
                    src={book.thumbnail}
                  />
                  <div className="pb-4" />
                  <p className="text-xl font-medium pb-4 leading-8">
                    {book.name}
                  </p>
                  <p className="text-lg pb-4">Tác giả: {book.author}</p>
                  <p className="text-lg pb-4">Kênh: {book.channel}</p>
                  <FormControlLabel
                    label={
                      <p className="text-lg text-[#1976d2]">Đánh dấu sách</p>
                    }
                    control={<Checkbox />}
                  />
                </Box>
              </Grid>
              <Grid item xs>
                <Box>
                  <p className="text-xl font-medium pb-4 text-blue-600/100">
                    Lời tựa
                  </p>
                  <p className="text-lg pb-4">{book.description}</p>
                  <Button
                    startIcon={<PlayArrowIcon />}
                    size="large"
                    variant="contained"
                  >
                    Phát tất cả
                  </Button>
                  <div className="pb-8" />
                  {audios.map((audio, key) => (
                    <UnitItem
                      onClick={() => setAudioIndex(key)}
                      key={key}
                      active={audioIndex == key ? 1 : 0}
                    >
                      <p className="text-lg">{audio.name}</p>
                    </UnitItem>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <div className="pb-8" />
        <Box
          sx={{
            bgcolor: "#3f51b5",
            height: "auto",
            width: "100%",
            padding: "38px",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs>
              <div className="w-full h-full flex justify-center items-center">
                {/* <SkipPreviousIcon sx={{ fontSize: 60, color: 'white' }} />
                                <div className='w-3'/>
                                <RotateLeftOutlinedIcon sx={{ fontSize: 48, color: 'white' }} />
                                <div className='w-3'/>
                                <PlayCircleOutlineIcon sx={{ fontSize: 85, color: 'white' }} />
                                <div className='w-3'/>
                                <RotateRightOutlinedIcon sx={{ fontSize: 48, color: 'white' }} />
                                <div className='w-3'/>
                                <SkipNextIcon sx={{ fontSize: 60, color: 'white' }} /> */}
                <ReactAudioPlayer
                  src={audios[audioIndex]?.url}
                  autoPlay
                  controls
                />
              </div>
            </Grid>
            <Grid item xs="auto">
              <Avatar sx={{ width: 136, height: 136 }} src={book.thumbnail} />
            </Grid>
            <Grid item xs>
              <div className="w-full h-full flex justify-center text-xl font-semibold items-center text-white">
                {book.name}
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};
export default Index;

Index.layout = Layout;

export async function getServerSideProps(context) {
  const { slug } = context.query;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/books/${slug}`
  );
  if (res.status == 200) {
    if (res.data.success == true) {
      const book = res.data.data;
      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}/audios`
      );
      if (res2.status == 200) {
        if (res2.data.success == true) {
          const audios = res2.data.data;
          return {
            props: {
              book,
              audios,
            },
          };
        }
      }
    }
  }
  return {
    props: {
      book: {},
      audios: {},
    },
  };
}
