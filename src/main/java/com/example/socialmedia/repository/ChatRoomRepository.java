package com.example.socialmedia.repository;

import com.example.socialmedia.entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findByUser1IdAndUser2Id(String user1Id, String user2Id);
    Optional<ChatRoom> findByUser2IdAndUser1Id(String user1Id, String user2Id);

}
