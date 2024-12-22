import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Dimensions, View, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import BlogCard from '@/components/Card/Card';  // Assuming BlogCard is correctly imported
import ImageTextCard from '@/components/Card/Card';
import { useRouter } from 'expo-router';
import useNews from '@/hooks/useNews';

const { width } = Dimensions.get('window');

const BlogsScreen = () => {
  const nav = useRouter();
  const { news, loading, getNews } = useNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

  useEffect(() => {
    if (news.length > 0) {
      const [firstPost, ...remainingPosts] = news;
      setFeaturedBlog(firstPost);
      setOtherBlogs(remainingPosts);  // Set remaining blogs as other blogs
    }
  }, [news]);

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await getNews();
    setRefreshing(false);
  };

  const renderBlogPostCard = ({ item }) => (
    <BlogPostCard onPress={() => handleBlogPostClick(item)}>
      <BlogPostImageContainer>
        <BlogPostImage source={{ uri: item.image }} resizeMode="cover" />
        <ReadTimeOverlay>
          <ReadTimeText>{item.readTime}</ReadTimeText>
        </ReadTimeOverlay>
      </BlogPostImageContainer>
      <BlogPostContent>
        <BlogPostTitle numberOfLines={2}>{item.title}</BlogPostTitle>
        <BlogPostInfo>
          {item.author} • {item.role}
        </BlogPostInfo>
      </BlogPostContent>
    </BlogPostCard>
  );

  const handleBlogPostClick = (blogPost) => {
    console.log('Clicked blog post:', blogPost.id);
    nav.push({
      pathname: '/details/[id]',
      params: { id: blogPost.id },
    });
  };

  // Filter otherBlogs based on searchQuery
  const filteredOtherBlogs = otherBlogs.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Split the blog posts into two parts
  const recentBlogs = news.slice(0, 2); // First 2 blogs for "Recent Blogs"

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={20} />
      </View>
    );
  }

  const paginatedBlogs = filteredOtherBlogs.slice(0, currentPage * itemsPerPage);

  const loadMoreBlogs = () => {
    if (paginatedBlogs.length < filteredOtherBlogs.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Container
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Logo source={require('@/assets/images/logo.png')} resizeMode="contain" />
      <ScreenTitle>News</ScreenTitle>
      {featuredBlog && (
        <FeaturedBlogCard onPress={() => handleBlogPostClick(featuredBlog)}>
          <BlogPostImage
            source={{ uri: featuredBlog.image }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <View style={styles.featuredOverlay} />
          <FeaturedBlogContent>
            <FeaturedBadge>
              <FeaturedBadgeText>Featured</FeaturedBadgeText>
            </FeaturedBadge>
            <FeaturedBlogTitle>{featuredBlog.title}</FeaturedBlogTitle>
            <FeaturedBlogInfo>
              {featuredBlog.author} • {featuredBlog.role}
            </FeaturedBlogInfo>
          </FeaturedBlogContent>
        </FeaturedBlogCard>
      )}

      <SectionTitle>Recent Blogs</SectionTitle>
      {recentBlogs.length > 0 ? (
        <BlogListContainer>
          <FlatList
            data={recentBlogs}
            renderItem={renderBlogPostCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          />
        </BlogListContainer>
      ) : (
        <NoResultsContainer>
          <NoResultsText>No recent blogs found for "{searchQuery}"</NoResultsText>
        </NoResultsContainer>
      )}

      <SectionTitle>Other Blogs</SectionTitle>
      <SearchBar>
        <SearchIcon>
          <MaterialIcons name="search" size={20} color="#666" />
        </SearchIcon>
        <SearchInput
          placeholder="Search blogs"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <ClearSearchIcon onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color="#666" />
          </ClearSearchIcon>
        )}
      </SearchBar>
      <View style={{ marginBottom: 40 }}>
        {filteredOtherBlogs.length > 0 ? (
          <FlatList
            data={paginatedBlogs}
            renderItem={({ item }) => (
              <ImageTextCard
                role={item.role}
                imageSource={item.image}
                title={item.title}
                onPress={() => handleBlogPostClick(item)}
                description={item.author}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loadMoreBlogs}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              paginatedBlogs.length < filteredOtherBlogs.length && (
                <ActivityIndicator size="small" color="#999" />
              )
            }
          />
        ) : (
          <NoResultsContainer>
            <NoResultsText>No other blogs found for "{searchQuery}"</NoResultsText>
          </NoResultsContainer>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  featuredImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const ScreenTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
`;

const Logo = styled.Image`
  width: 200px;
  height: 40px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 16px 0;
`;

const ClearSearchIcon = styled.TouchableOpacity`
  padding: 8px;
`;

const BlogListContainer = styled.View`
  height: 250px;
`;

const FeaturedBlogCard = styled.TouchableOpacity`
  height: 250px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const FeaturedBlogContent = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
`;

const FeaturedBadge = styled.View`
  background-color: #007bff;
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const FeaturedBadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const FeaturedBlogTitle = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const FeaturedBlogInfo = styled.Text`
  color: rgba(255,255,255,0.8);
  font-size: 14px;
`;

const NoResultsContainer = styled.View`
  padding: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px
`;

const NoResultsText = styled.Text`
  color: #999999;
  font-size: 16px;
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: #fff;
  padding: 16px;
  padding-top: ${Platform.OS === "android" ? '50px': '0'}
`;

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  height: 52px;
  background-color: #ffffff;
  padding: 0 16px;
  border-radius: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  margin-bottom: 16px;
`;

const SearchIcon = styled.View`
  margin-right: 12px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #333;
`;

const BlogPostCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 12px;
  width: ${width * 0.7}px;
  margin-right: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const BlogPostImageContainer = styled.View`
  position: relative;
`;

const ReadTimeOverlay = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0,0,0,0.5);
  padding: 4px 8px;
  border-radius: 4px;
`;

const ReadTimeText = styled.Text`
  color: white;
  font-size: 12px;
`;

const BlogPostImage = styled.Image`
  height: 180px;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const BlogPostContent = styled.View`
  padding: 16px;
`;

const BlogPostTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const BlogPostInfo = styled.Text`
  color: #666666;
  font-size: 14px;
`;

export default BlogsScreen;