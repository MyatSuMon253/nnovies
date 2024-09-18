import Poster from "@/components/Poster";
import Slide from "@/components/Slide";
import React, { FC, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, RefreshControl } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";

const API_KEY = "9f0733a0515955a372c65d2197e09a89";

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const View = styled.View`
  flex: 1;
`;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const ListTitle = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-left: 30px;
`;

const TrendingScroll = styled.ScrollView`
  margin-top: 20px;
`;

const Movie = styled.View`
  margin-right: 20px;
  align-items: center;
`;

const Title = styled.Text`
  color: white;
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`;

const Votes = styled.Text`
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const HMovie = styled.View`
  padding: 0px 30px;
  flex-direction: row;
`;

const HColumn = styled.View`
  margin-left: 15px;
  width: 80%;
`;

const Overview = styled.Text`
  color: white;
  opacity: 0.8;
  width: 80%;
`;

const Release = styled.Text`
  color: white;
  font-size: 12px;
  margin-vertical: 10;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 30px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Movies: FC<NativeStackScreenProps<any, "Movies">> = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZjA3MzNhMDUxNTk1NWEzNzJjNjVkMjE5N2UwOWE4OSIsIm5iZiI6MTcyNDg2MDk5MC4wNDEyODUsInN1YiI6IjY2Y2YzNGM4MWU5OWU0NThkZjY5ZjQxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WqFPMS44lRUZwRtugMMx_G2EIzNOWc5RXyY4N2rmdNM",
    },
  };

  const getPopular = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/trending?language=en-US&page=1&region=US`,
        options
      )
    ).json();
    console.log(results);
    setPopular(results);
    setLoading(false);
  };

  const getUpcoming = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&region=US`,
        options
      )
    ).json();
    console.log(results);
    setUpcoming(results);
    setLoading(false);
  };

  const getNowPlaying = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=US`,
        options
      )
    ).json();
    console.log(results);
    setNowPlayingMovies(results);
    setLoading(false);
  };

  const getData = async () => {
    setLoading(true);
    // wait for all of them
    await Promise.all([getPopular(), getUpcoming(), getNowPlaying()]);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  return loading ? (
    <Loader>
      <ActivityIndicator size="small" />
    </Loader>
  ) : (
    <Container
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Swiper
        loop
        horizontal
        autoplay
        autoplayTimeout={3.5}
        showsButtons={false}
        showsPagination={false}
        containerStyle={{
          marginBottom: 30,
          width: "100%",
          height: SCREEN_HEIGHT / 4,
        }}
      >
        {nowPlayingMovies.map((movie) => (
          <Slide
            key={movie.id}
            backdropPath={movie.backdrop_path}
            posterPath={movie.poster_path}
            originalTitle={movie.original_title}
            voteAverage={movie.vote_average}
            overview={movie.overview}
          />
        ))}
      </Swiper>
      <ListContainer>
        <ListTitle>Trending Movies</ListTitle>
        <TrendingScroll
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 30 }}
        >
          {popular?.map((movie) => (
            <Movie key={movie.id}>
              <Poster path={movie.poster_path} />
              <Title>
                {movie.original_title.slice(0, 13)}
                {movie.original_title.length > 13 ? "..." : null}
              </Title>
              {movie.vote_average > 0 ? (
                <Votes>* {movie.vote_average / 10}</Votes>
              ) : (
                `Coming Soon`
              )}
            </Movie>
          ))}
        </TrendingScroll>
      </ListContainer>
      <ComingSoonTitle>Coming Soon</ComingSoonTitle>
      {upcoming?.map((movie) => (
        <HMovie key={movie.id}>
          <Poster path={movie.poster_path} />
          <HColumn>
            <Title>{movie.original_title}</Title>
            <Overview>
              {movie.overview !== "" && movie.overview.length > 80
                ? `${movie.overview.slice(0, 140)}...`
                : movie.overview}
            </Overview>
            <Release>
              {new Date(movie.release_date).toLocaleDateString("en")}
            </Release>
          </HColumn>
        </HMovie>
      ))}
    </Container>
  );
};

export default Movies;
