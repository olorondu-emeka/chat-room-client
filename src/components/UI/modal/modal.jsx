import React from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/core"

import "./modal.css"

const MyModal = ({ isOpen, modalTitle, modalContent }) => {
  const { onOpen, onClose } = useDisclosure()
  return (
    <div className="my-modal">
      <Modal preserveScrollBarGap isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>{modalContent}</ModalBody>

          {/* <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default MyModal
